const express = require('express');
const router = express.Router();
const { db, MAX_BORROW } = require('../db');

// GET all members
router.get('/', (req, res) => {
  try {
    const members = db.data.members.map(member => {
      const borrowedItems = db.data.items.filter(item => item.memberId === member.id);
      return {
        ...member,
        borrowedCount: borrowedItems.length,
        maxBorrow: MAX_BORROW,
        canBorrowMore: borrowedItems.length < MAX_BORROW,
        borrowedItems
      };
    });

    res.json({
      success: true,
      count: members.length,
      members
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single member
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const member = db.data.members.find(m => m.id === id);
  if (!member) {
    return res.status(404).json({ success: false, message: `Member with ID ${id} not found.` });
  }
  const borrowedItems = db.data.items.filter(item => item.memberId === id);
  res.json({
    success: true,
    member: {
      ...member,
      borrowedCount: borrowedItems.length,
      maxBorrow: MAX_BORROW,
      borrowedItems
    }
  });
});

// POST register new member
router.post('/', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Member name cannot be empty.' });
    }

    const newId = db.nextMemberId();
    const newMember = {
      id: newId,
      name: name.trim(),
      joinedAt: new Date().toISOString()
    };

    db.data.members.push(newMember);
    db.logActivity('REGISTER_MEMBER', `Registered member "${newMember.name}" with ID #${newId}`, {
      memberId: newId,
      name: newMember.name
    });
    db.persist();

    res.status(201).json({
      success: true,
      message: `Member registered with ID ${newId}.`,
      member: {
        ...newMember,
        borrowedCount: 0,
        maxBorrow: MAX_BORROW,
        borrowedItems: []
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE member
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const memberIndex = db.data.members.findIndex(m => m.id === id);

    if (memberIndex === -1) {
      return res.status(404).json({ success: false, message: `Member with ID ${id} not found.` });
    }

    const member = db.data.members[memberIndex];
    const borrowedCount = db.getBorrowedCount(id);

    if (borrowedCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot remove member "${member.name}". They currently have ${borrowedCount} item(s) issued.`
      });
    }

    db.data.members.splice(memberIndex, 1);
    db.logActivity('REMOVE_MEMBER', `Removed member "${member.name}" (ID: ${member.id})`, { memberId: id });
    db.persist();

    res.json({
      success: true,
      message: `Member #${id} removed successfully.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
