const express = require('express');
const router = express.Router();
const { db, MAX_BORROW, ALLOWED_DAYS } = require('../db');

// Issue item to member
router.post('/issue', (req, res) => {
  try {
    const { itemId, memberId } = req.body;

    const parsedItemId = parseInt(itemId, 10);
    const parsedMemberId = parseInt(memberId, 10);

    if (isNaN(parsedItemId) || isNaN(parsedMemberId)) {
      return res.status(400).json({ success: false, message: 'Valid Item ID and Member ID are required.' });
    }

    const item = db.data.items.find(i => i.id === parsedItemId);
    if (!item) {
      return res.status(404).json({ success: false, message: `Item with ID ${parsedItemId} not found.` });
    }

    const member = db.data.members.find(m => m.id === parsedMemberId);
    if (!member) {
      return res.status(404).json({ success: false, message: `Member with ID ${parsedMemberId} not found.` });
    }

    // C++ rule: Reference books cannot be issued
    if (item.type === 'Reference') {
      return res.status(400).json({ success: false, message: 'Reference books cannot be issued.' });
    }

    // C++ rule: Check if already issued
    if (item.memberId !== 0) {
      return res.status(400).json({ success: false, message: 'This item is already issued.' });
    }

    // C++ rule: Member limit check (MAX_BORROW = 3)
    const currentBorrowedCount = db.getBorrowedCount(parsedMemberId);
    if (currentBorrowedCount >= MAX_BORROW) {
      return res.status(400).json({
        success: false,
        message: `${member.name} has reached the limit of ${MAX_BORROW} items.`
      });
    }

    // Perform issue
    item.memberId = parsedMemberId;
    item.issueDate = new Date().toISOString();

    db.logActivity('ISSUE', `"${item.title}" issued to ${member.name} for ${ALLOWED_DAYS} days.`, {
      itemId: item.id,
      memberId: member.id,
      itemTitle: item.title,
      memberName: member.name
    });
    db.persist();

    res.json({
      success: true,
      message: `"${item.title}" issued to ${member.name} for ${ALLOWED_DAYS} days.`,
      item,
      member
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Preview / Calculate fine
router.post('/preview-return', (req, res) => {
  try {
    const { itemId, daysKept } = req.body;
    const parsedItemId = parseInt(itemId, 10);
    const item = db.data.items.find(i => i.id === parsedItemId);

    if (!item) {
      return res.status(404).json({ success: false, message: `Item with ID ${parsedItemId} not found.` });
    }

    if (item.memberId === 0) {
      return res.status(400).json({ success: false, message: 'This item is not issued.' });
    }

    const member = db.data.members.find(m => m.id === item.memberId);

    // Determine days kept
    let days = parseInt(daysKept, 10);
    if (isNaN(days) || days < 0) {
      if (item.issueDate) {
        const diffMs = Date.now() - new Date(item.issueDate).getTime();
        days = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      } else {
        days = 1;
      }
    }

    const calculation = db.calculateFine(item, days);

    res.json({
      success: true,
      item,
      member,
      allowedDays: ALLOWED_DAYS,
      daysKept: days,
      daysLate: calculation.daysLate,
      ratePerDay: calculation.rate,
      fine: calculation.fine
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Return item
router.post('/return', (req, res) => {
  try {
    const { itemId, daysKept } = req.body;
    const parsedItemId = parseInt(itemId, 10);

    const item = db.data.items.find(i => i.id === parsedItemId);
    if (!item) {
      return res.status(404).json({ success: false, message: `Item with ID ${parsedItemId} not found.` });
    }

    if (item.memberId === 0) {
      return res.status(400).json({ success: false, message: 'This item was not issued.' });
    }

    const member = db.data.members.find(m => m.id === item.memberId);
    const memberName = member ? member.name : `Member #${item.memberId}`;

    // Determine days kept
    let days = parseInt(daysKept, 10);
    if (isNaN(days) || days < 0) {
      if (item.issueDate) {
        const diffMs = Date.now() - new Date(item.issueDate).getTime();
        days = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      } else {
        days = 1;
      }
    }

    const calculation = db.calculateFine(item, days);
    const lateDays = calculation.daysLate;
    const fine = calculation.fine;

    // Reset item
    const previousMemberId = item.memberId;
    item.memberId = 0;
    item.issueDate = null;

    let message = `Item returned.`;
    if (fine > 0) {
      message += ` Late by ${lateDays} day(s). Fine: ₹${fine}`;
    }

    db.logActivity('RETURN', `"${item.title}" returned by ${memberName}.${fine > 0 ? ` (Late by ${lateDays}d, Fine: ₹${fine})` : ''}`, {
      itemId: item.id,
      memberId: previousMemberId,
      daysKept: days,
      daysLate: lateDays,
      fine
    });
    db.persist();

    res.json({
      success: true,
      message,
      fine,
      daysLate: lateDays,
      daysKept: days,
      item
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
