const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  try {
    const items = db.data.items;
    const members = db.data.members;
    const activities = db.data.activities;

    const totalBooks = items.filter(i => i.type === 'Book').length;
    const totalMagazines = items.filter(i => i.type === 'Magazine').length;
    const totalReferenceBooks = items.filter(i => i.type === 'Reference').length;
    const totalItems = items.length;
    const registeredMembers = members.length;
    const currentlyIssued = items.filter(i => i.memberId !== 0).length;
    const availableItems = items.filter(i => i.memberId === 0).length;

    // Calculate overdue items (daysKept > 7)
    const overdueItems = items.filter(i => {
      if (!i.memberId || !i.issueDate) return false;
      const days = Math.floor((Date.now() - new Date(i.issueDate).getTime()) / (1000 * 60 * 60 * 24));
      return days > 7;
    }).map(i => {
      const member = members.find(m => m.id === i.memberId);
      const daysKept = Math.max(1, Math.floor((Date.now() - new Date(i.issueDate).getTime()) / (1000 * 60 * 60 * 24)));
      const fineCalc = db.calculateFine(i, daysKept);
      return {
        ...i,
        memberName: member ? member.name : `Member #${i.memberId}`,
        daysKept,
        daysLate: fineCalc.daysLate,
        estimatedFine: fineCalc.fine
      };
    });

    res.json({
      success: true,
      stats: {
        totalBooks,
        totalMagazines,
        totalReferenceBooks,
        totalItems,
        registeredMembers,
        currentlyIssued,
        availableItems,
        overdueCount: overdueItems.length
      },
      recentActivity: activities.slice(0, 10),
      overdueItems
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
