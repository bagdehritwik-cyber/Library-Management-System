const express = require('express');
const router = express.Router();
const { db } = require('../db');

// GET all items (with optional filters)
router.get('/', (req, res) => {
  try {
    const { search, type, status } = req.query;
    let items = db.data.items.map(item => {
      const member = item.memberId ? db.data.members.find(m => m.id === item.memberId) : null;
      let daysKept = 0;
      let isOverdue = false;
      if (item.issueDate && item.memberId) {
        const diffMs = Date.now() - new Date(item.issueDate).getTime();
        daysKept = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        isOverdue = daysKept > 7;
      }
      return {
        ...item,
        member,
        daysKept,
        isOverdue
      };
    });

    // Filter by type
    if (type && type !== 'All') {
      items = items.filter(i => i.type.toLowerCase() === type.toLowerCase());
    }

    // Filter by status
    if (status === 'available') {
      items = items.filter(i => i.memberId === 0);
    } else if (status === 'issued') {
      items = items.filter(i => i.memberId !== 0);
    }

    // Search keyword
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        (i.detail && i.detail.toLowerCase().includes(q)) ||
        (i.author && i.author.toLowerCase().includes(q)) ||
        i.id.toString() === q
      );
    }

    res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single item
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = db.data.items.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ success: false, message: `Item with ID ${id} not found.` });
  }
  const member = item.memberId ? db.data.members.find(m => m.id === item.memberId) : null;
  res.json({ success: true, item: { ...item, member } });
});

// POST new item
router.post('/', (req, res) => {
  try {
    const { type, title, author, issueNo } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title cannot be empty.' });
    }

    if (!type || !['Book', 'Magazine', 'Reference'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid item type. Must be Book, Magazine, or Reference.' });
    }

    let detail = '';
    let authorVal = null;
    let issueNoVal = null;

    if (type === 'Book') {
      if (!author || !author.trim()) {
        return res.status(400).json({ success: false, message: 'Author cannot be empty for books.' });
      }
      detail = author.trim();
      authorVal = author.trim();
    } else if (type === 'Magazine') {
      const parsedIssue = parseInt(issueNo, 10);
      if (isNaN(parsedIssue) || parsedIssue <= 0) {
        return res.status(400).json({ success: false, message: 'Valid positive issue number is required for magazines.' });
      }
      detail = `Issue ${parsedIssue}`;
      issueNoVal = parsedIssue;
    } else if (type === 'Reference') {
      if (!author || !author.trim()) {
        return res.status(400).json({ success: false, message: 'Author cannot be empty for reference books.' });
      }
      detail = author.trim();
      authorVal = author.trim();
    }

    const newItem = {
      id: db.nextItemId(),
      type,
      title: title.trim(),
      detail,
      author: authorVal,
      issueNo: issueNoVal,
      memberId: 0,
      issueDate: null,
      createdAt: new Date().toISOString()
    };

    db.data.items.push(newItem);
    db.logActivity('ADD_ITEM', `Added ${type} "${newItem.title}"`, { itemId: newItem.id, type });
    db.persist();

    res.status(201).json({
      success: true,
      message: `${type} added successfully.`,
      item: newItem
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE item
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const itemIndex = db.data.items.findIndex(i => i.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: `Item with ID ${id} not found.` });
    }

    const item = db.data.items[itemIndex];

    // C++ rule: Cannot remove an issued item
    if (item.memberId !== 0) {
      return res.status(400).json({ success: false, message: 'Cannot remove an issued item.' });
    }

    db.data.items.splice(itemIndex, 1);
    db.logActivity('REMOVE_ITEM', `Removed ${item.type} "${item.title}" (ID: ${item.id})`, { itemId: id });
    db.persist();

    res.json({
      success: true,
      message: `Item #${id} removed successfully.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
