import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import MembersPage from './pages/MembersPage';
import IssueReturnPage from './pages/IssueReturnPage';
import OOPConceptsPage from './pages/OOPConceptsPage';
import ItemModal from './components/ItemModal';
import MemberModal from './components/MemberModal';
import IssueModal from './components/IssueModal';
import ReturnModal from './components/ReturnModal';
import ConfirmationModal from './components/ConfirmationModal';
import { ToastProvider, useToast } from './components/Toast';
import { api } from './services/api';

function AppContent() {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data states
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMagazines: 0,
    totalReferenceBooks: 0,
    totalItems: 0,
    registeredMembers: 0,
    currentlyIssued: 0,
    availableItems: 0,
    overdueCount: 0
  });
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [overdueItems, setOverdueItems] = useState([]);
  const [oopConcepts, setOopConcepts] = useState([]);
  const [cppSourceCode, setCppSourceCode] = useState('');

  // Modals
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [preselectedItemId, setPreselectedItemId] = useState(null);

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    danger: true
  });

  // Fetch all data
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, itemsRes, membersRes] = await Promise.all([
        api.getDashboard().catch(() => ({ stats: {}, recentActivity: [], overdueItems: [] })),
        api.getItems().catch(() => ({ items: [] })),
        api.getMembers().catch(() => ({ members: [] })),
      ]);

      if (dashRes?.stats) setStats(dashRes.stats);
      if (dashRes?.recentActivity) setRecentActivity(dashRes.recentActivity);
      if (dashRes?.overdueItems) setOverdueItems(dashRes.overdueItems);
      if (itemsRes?.items) setItems(itemsRes.items);
      if (membersRes?.members) setMembers(membersRes.members);
    } catch (err) {
      console.error('Failed to load library data:', err);
      addToast('Failed to load library data', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Load OOP concepts and source code on start
  useEffect(() => {
    loadAllData();

    api.getOOPConcepts()
      .then(res => {
        if (res?.concepts) setOopConcepts(res.concepts);
      })
      .catch(console.error);

    api.getCPPSourceCode()
      .then(res => {
        if (res?.code) setCppSourceCode(res.code);
      })
      .catch(console.error);
  }, [loadAllData]);

  // Add Item
  const handleAddItem = async (itemData) => {
    await api.addItem(itemData);
    await loadAllData();
  };

  // Delete Item
  const handleDeleteItemClick = (item) => {
    if (item.memberId !== 0) {
      addToast('Cannot remove an issued item per C++ rule.', 'error');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: `Remove ${item.type}`,
      message: `Are you sure you want to remove "${item.title}" (ID: #${item.id}) from the library catalog? This action will update items.txt.`,
      danger: true,
      onConfirm: async () => {
        try {
          await api.deleteItem(item.id);
          addToast(`Item #${item.id} removed successfully`, 'success');
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          await loadAllData();
        } catch (err) {
          addToast(err.message || 'Failed to remove item', 'error');
        }
      }
    });
  };

  // Add Member
  const handleAddMember = async (name) => {
    await api.addMember(name);
    await loadAllData();
  };

  // Delete Member
  const handleDeleteMemberClick = (member) => {
    if (member.borrowedCount > 0) {
      addToast(`Cannot remove member "${member.name}" because they have ${member.borrowedCount} item(s) borrowed.`, 'error');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Remove Member',
      message: `Are you sure you want to remove registered member "${member.name}" (ID: #${member.id})? This action will update members.txt.`,
      danger: true,
      onConfirm: async () => {
        try {
          await api.deleteMember(member.id);
          addToast(`Member #${member.id} removed`, 'success');
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          await loadAllData();
        } catch (err) {
          addToast(err.message || 'Failed to remove member', 'error');
        }
      }
    });
  };

  // Issue Item
  const handleIssueItem = async (itemId, memberId) => {
    await api.issueItem(itemId, memberId);
    await loadAllData();
  };

  // Return Item
  const handleReturnItem = async (itemId, daysKept) => {
    const res = await api.returnItem(itemId, daysKept);
    await loadAllData();
    return res;
  };

  // Quick Open Issue with preselected Item
  const handleQuickIssue = (itemId = null) => {
    setPreselectedItemId(itemId);
    setIssueModalOpen(true);
  };

  // Quick Open Return with preselected Item
  const handleQuickReturn = (itemId = null) => {
    setPreselectedItemId(itemId);
    setReturnModalOpen(true);
  };

  const issuedItems = items.filter(i => i.memberId !== 0);
  const nextMemberId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Workspace */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <Navbar
          activeTab={activeTab}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenAddItem={() => setItemModalOpen(true)}
          onOpenRegisterMember={() => setMemberModalOpen(true)}
          onOpenIssue={() => handleQuickIssue(null)}
          onRefresh={loadAllData}
          loading={loading}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardPage
              stats={stats}
              recentActivity={recentActivity}
              overdueItems={overdueItems}
              onOpenAddItem={() => setItemModalOpen(true)}
              onOpenRegisterMember={() => setMemberModalOpen(true)}
              onOpenIssue={() => handleQuickIssue(null)}
              onOpenReturn={() => handleQuickReturn(null)}
              onNavigateToTab={setActiveTab}
              onQuickReturnItem={handleQuickReturn}
              onQuickIssueItem={handleQuickIssue}
            />
          )}

          {activeTab === 'items' && (
            <BooksPage
              items={items}
              loading={loading}
              onOpenAddItem={() => setItemModalOpen(true)}
              onOpenIssue={handleQuickIssue}
              onOpenReturn={handleQuickReturn}
              onDeleteItem={handleDeleteItemClick}
            />
          )}

          {activeTab === 'members' && (
            <MembersPage
              members={members}
              loading={loading}
              onOpenRegisterMember={() => setMemberModalOpen(true)}
              onOpenIssueForMember={(memberId) => {
                setPreselectedItemId(null);
                setIssueModalOpen(true);
              }}
              onOpenReturnItem={handleQuickReturn}
              onDeleteMember={handleDeleteMemberClick}
            />
          )}

          {activeTab === 'issue-return' && (
            <IssueReturnPage
              issuedItems={issuedItems}
              members={members}
              onOpenIssue={() => handleQuickIssue(null)}
              onOpenReturn={() => handleQuickReturn(null)}
              onQuickReturnItem={handleQuickReturn}
            />
          )}

          {activeTab === 'oop-concepts' && (
            <OOPConceptsPage
              concepts={oopConcepts}
              cppSourceCode={cppSourceCode}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <ItemModal
        isOpen={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onItemAdded={handleAddItem}
      />

      <MemberModal
        isOpen={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        onMemberAdded={handleAddMember}
        nextId={nextMemberId}
      />

      <IssueModal
        isOpen={issueModalOpen}
        onClose={() => {
          setIssueModalOpen(false);
          setPreselectedItemId(null);
        }}
        items={items}
        members={members}
        onIssueSuccess={handleIssueItem}
        preselectedItemId={preselectedItemId}
      />

      <ReturnModal
        isOpen={returnModalOpen}
        onClose={() => {
          setReturnModalOpen(false);
          setPreselectedItemId(null);
        }}
        issuedItems={issuedItems}
        members={members}
        onReturnSuccess={handleReturnItem}
        preselectedItemId={preselectedItemId}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        danger={confirmModal.danger}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
