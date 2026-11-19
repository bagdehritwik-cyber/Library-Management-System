const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'library.json');
const ITEMS_TXT = path.join(__dirname, '..', 'items.txt');
const MEMBERS_TXT = path.join(__dirname, '..', 'members.txt');

// Business constants from C++ project
const MAX_BORROW = 3;
const ALLOWED_DAYS = 7;
const FINE_RATE_BOOK = 2.0;       // Rs 2 per day
const FINE_RATE_MAGAZINE = 5.0;   // Rs 5 per day
const FINE_RATE_REFERENCE = 0.0;  // Reference books cannot be issued

const initialData = {
  items: [
    {
      id: 1,
      type: 'Book',
      title: 'Clean Code',
      detail: 'Robert C. Martin',
      author: 'Robert C. Martin',
      issueNo: null,
      memberId: 1,
      issueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      type: 'Magazine',
      title: 'Wired',
      detail: 'Issue 12',
      author: null,
      issueNo: 12,
      memberId: 0,
      issueDate: null,
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      type: 'Reference',
      title: 'C++ Primer',
      detail: 'Stanley B. Lippman',
      author: 'Stanley B. Lippman',
      issueNo: null,
      memberId: 0,
      issueDate: null,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 4,
      type: 'Book',
      title: 'Design Patterns',
      detail: 'Erich Gamma, Richard Helm',
      author: 'Erich Gamma, Richard Helm',
      issueNo: null,
      memberId: 0,
      issueDate: null,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 5,
      type: 'Book',
      title: 'The Pragmatic Programmer',
      detail: 'Andrew Hunt, David Thomas',
      author: 'Andrew Hunt, David Thomas',
      issueNo: null,
      memberId: 2,
      issueDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago (2 days overdue!)
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 6,
      type: 'Magazine',
      title: 'National Geographic',
      detail: 'Issue 45',
      author: null,
      issueNo: 45,
      memberId: 0,
      issueDate: null,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 7,
      type: 'Reference',
      title: 'The C++ Programming Language',
      detail: 'Bjarne Stroustrup',
      author: 'Bjarne Stroustrup',
      issueNo: null,
      memberId: 0,
      issueDate: null,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  members: [
    {
      id: 1,
      name: 'Rahul Sharma',
      joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      name: 'Priya Patel',
      joinedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      name: 'Amit Verma',
      joinedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  activities: [
    {
      id: 1,
      type: 'ISSUE',
      description: 'Issued "Clean Code" to Rahul Sharma',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: { itemId: 1, memberId: 1 }
    },
    {
      id: 2,
      type: 'ISSUE',
      description: 'Issued "The Pragmatic Programmer" to Priya Patel',
      timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: { itemId: 5, memberId: 2 }
    },
    {
      id: 3,
      type: 'ADD_ITEM',
      description: 'Added Reference Book "The C++ Programming Language"',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: { itemId: 7, type: 'Reference' }
    }
  ]
};

class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        // Check if items.txt or members.txt exist from previous C++ run
        const importedData = this.importFromTextFiles();
        if (importedData) {
          this.data = importedData;
        } else {
          this.data = JSON.parse(JSON.stringify(initialData));
        }
        this.persist();
      }
      this.syncToTextFiles();
    } catch (err) {
      console.error('Database initialization error:', err);
      this.data = JSON.parse(JSON.stringify(initialData));
      this.persist();
    }
  }

  importFromTextFiles() {
    if (!fs.existsSync(ITEMS_TXT) && !fs.existsSync(MEMBERS_TXT)) {
      return null;
    }

    const items = [];
    const members = [];

    if (fs.existsSync(ITEMS_TXT)) {
      const lines = fs.readFileSync(ITEMS_TXT, 'utf-8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const parts = trimmed.split('|');
        if (parts.length >= 5) {
          const type = parts[0];
          const id = parseInt(parts[1], 10);
          const title = parts[2];
          const detail = parts[3];
          const memberId = parseInt(parts[4], 10);
          let author = null;
          let issueNo = null;

          if (type === 'Magazine') {
            const match = detail.match(/Issue\s*(\d+)/i);
            issueNo = match ? parseInt(match[1], 10) : 1;
          } else {
            author = detail;
          }

          items.push({
            id,
            type,
            title,
            detail,
            author,
            issueNo,
            memberId,
            issueDate: memberId !== 0 ? new Date().toISOString() : null,
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    if (fs.existsSync(MEMBERS_TXT)) {
      const lines = fs.readFileSync(MEMBERS_TXT, 'utf-8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const parts = trimmed.split('|');
        if (parts.length >= 2) {
          members.push({
            id: parseInt(parts[0], 10),
            name: parts[1],
            joinedAt: new Date().toISOString()
          });
        }
      }
    }

    if (items.length > 0 || members.length > 0) {
      return {
        items: items.length > 0 ? items : initialData.items,
        members: members.length > 0 ? members : initialData.members,
        activities: [
          {
            id: 1,
            type: 'ADD_ITEM',
            description: 'Imported items from items.txt and members.txt',
            timestamp: new Date().toISOString()
          }
        ]
      };
    }

    return null;
  }

  persist() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
      this.syncToTextFiles();
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  syncToTextFiles() {
    try {
      // Sync items.txt matching C++ format: Type|ID|Title|Author/Issue|MemberID
      const itemLines = this.data.items.map(item => {
        return `${item.type}|${item.id}|${item.title}|${item.detail}|${item.memberId}`;
      });
      fs.writeFileSync(ITEMS_TXT, itemLines.join('\n') + (itemLines.length ? '\n' : ''), 'utf-8');

      // Sync members.txt matching C++ format: ID|Name
      const memberLines = this.data.members.map(member => {
        return `${member.id}|${member.name}`;
      });
      fs.writeFileSync(MEMBERS_TXT, memberLines.join('\n') + (memberLines.length ? '\n' : ''), 'utf-8');
    } catch (err) {
      console.error('Failed to sync to text files:', err);
    }
  }

  logActivity(type, description, metadata = {}) {
    const activity = {
      id: Date.now(),
      type,
      description,
      timestamp: new Date().toISOString(),
      metadata
    };
    this.data.activities.unshift(activity);
    if (this.data.activities.length > 50) {
      this.data.activities = this.data.activities.slice(0, 50);
    }
  }

  // Next ID calculations matching C++ logic
  nextItemId() {
    if (!this.data.items.length) return 1;
    return Math.max(...this.data.items.map(i => i.id)) + 1;
  }

  nextMemberId() {
    if (!this.data.members.length) return 1;
    return Math.max(...this.data.members.map(m => m.id)) + 1;
  }

  getBorrowedCount(memberId) {
    return this.data.items.filter(i => i.memberId === memberId).length;
  }

  // Calculate fine strictly per C++ rules
  calculateFine(item, daysKept) {
    const daysLate = Math.max(0, daysKept - ALLOWED_DAYS);
    if (daysLate <= 0) return { daysLate: 0, fine: 0 };

    let rate = 0;
    if (item.type === 'Book') {
      rate = FINE_RATE_BOOK;
    } else if (item.type === 'Magazine') {
      rate = FINE_RATE_MAGAZINE;
    } else if (item.type === 'Reference') {
      rate = FINE_RATE_REFERENCE;
    }

    return {
      daysLate,
      fine: daysLate * rate,
      rate
    };
  }
}

const db = new Database();

module.exports = {
  db,
  MAX_BORROW,
  ALLOWED_DAYS,
  FINE_RATE_BOOK,
  FINE_RATE_MAGAZINE,
  FINE_RATE_REFERENCE
};
