const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3002;
process.env.PORT = PORT;

// Start server
require('./index.js');

async function request(path, options = {}) {
  const url = `http://127.0.0.1:${PORT}${path}`;
  const res = await fetch(url, options);
  const json = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data: json };
}

async function runTests() {
  console.log('--- Starting Integration Tests ---');
  // Wait for server to bind
  await new Promise(r => setTimeout(r, 1000));

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✓ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${message}`);
    }
  }

  // 1. Dashboard
  const dash = await request('/api/dashboard');
  assert(dash.ok && dash.data.stats.totalItems > 0, 'Dashboard returns stats and items count');
  assert(dash.data.stats.totalBooks >= 1, 'Dashboard counts total books');
  assert(dash.data.stats.totalMagazines >= 1, 'Dashboard counts total magazines');
  assert(dash.data.stats.totalReferenceBooks >= 1, 'Dashboard counts reference books');
  assert(dash.data.stats.registeredMembers >= 1, 'Dashboard counts members');

  // 2. Items list
  const itemsRes = await request('/api/items');
  assert(itemsRes.ok && Array.isArray(itemsRes.data.items), 'GET /api/items returns array of items');

  // 3. Add items
  const addBookRes = await request('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'Book',
      title: 'Structure and Interpretation of Computer Programs',
      author: 'Harold Abelson, Gerald Jay Sussman'
    })
  });
  assert(addBookRes.status === 201 && addBookRes.data.item.type === 'Book', 'POST /api/items adds Book successfully');
  const createdBookId = addBookRes.data.item.id;

  const addMagRes = await request('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'Magazine',
      title: 'Communications of the ACM',
      issueNo: 64
    })
  });
  assert(addMagRes.status === 201 && addMagRes.data.item.type === 'Magazine', 'POST /api/items adds Magazine successfully');

  const addRefRes = await request('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'Reference',
      title: 'Modern Operating Systems',
      author: 'Andrew S. Tanenbaum'
    })
  });
  assert(addRefRes.status === 201 && addRefRes.data.item.type === 'Reference', 'POST /api/items adds Reference Book successfully');
  const createdRefId = addRefRes.data.item.id;

  // 4. Register member
  const addMemRes = await request('/api/members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Vikram Singh' })
  });
  assert(addMemRes.status === 201 && addMemRes.data.member.name === 'Vikram Singh', 'POST /api/members registers new member');
  const newMemberId = addMemRes.data.member.id;

  // 5. Issue rule: Reference books CANNOT be issued
  const issueRefRes = await request('/api/transactions/issue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId: createdRefId, memberId: newMemberId })
  });
  assert(issueRefRes.status === 400 && issueRefRes.data.message.includes('Reference books cannot be issued'), 'Reference book issue blocked with C++ exception');

  // 6. Issue Book to member
  const issueBookRes = await request('/api/transactions/issue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId: createdBookId, memberId: newMemberId })
  });
  assert(issueBookRes.ok && issueBookRes.data.item.memberId === newMemberId, 'Issue book to member succeeds');

  // 7. Cannot remove an issued item
  const delIssuedRes = await request(`/api/items/${createdBookId}`, { method: 'DELETE' });
  assert(delIssuedRes.status === 400 && delIssuedRes.data.message.includes('Cannot remove an issued item'), 'Delete issued item blocked with C++ rule');

  // 8. Calculate fine preview: 10 days kept (3 days late) for Book @ ₹2/day = ₹6
  const previewRes = await request('/api/transactions/preview-return', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId: createdBookId, daysKept: 10 })
  });
  assert(previewRes.ok && previewRes.data.daysLate === 3 && previewRes.data.fine === 6, 'Preview fine calculates ₹6 for 3 days late on Book (₹2/day)');

  // 9. Return book with fine
  const returnRes = await request('/api/transactions/return', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId: createdBookId, daysKept: 10 })
  });
  assert(returnRes.ok && returnRes.data.fine === 6 && returnRes.data.item.memberId === 0, 'Return book succeeds with fine and resets memberId to 0');

  // 10. Now delete the returned item (succeeds)
  const delReturnedRes = await request(`/api/items/${createdBookId}`, { method: 'DELETE' });
  assert(delReturnedRes.ok, 'Delete returned item succeeds');

  // 11. OOP concepts check
  const oopRes = await request('/api/oop-concepts');
  assert(oopRes.ok && oopRes.data.count === 16, 'GET /api/oop-concepts returns all 16 concepts');

  // 12. Check items.txt and members.txt existence & format
  const itemsTxtPath = path.join(__dirname, '..', 'items.txt');
  const membersTxtPath = path.join(__dirname, '..', 'members.txt');
  assert(fs.existsSync(itemsTxtPath), 'items.txt exists and is synced');
  assert(fs.existsSync(membersTxtPath), 'members.txt exists and is synced');

  const itemsTxt = fs.readFileSync(itemsTxtPath, 'utf-8');
  assert(itemsTxt.includes('Book|') && itemsTxt.includes('Magazine|') && itemsTxt.includes('Reference|'), 'items.txt matches C++ pipe-separated format');

  console.log(`\nResults: ${passed} / ${total} tests passed!`);
  if (passed === total) {
    console.log('✓ ALL INTEGRATION TESTS PASSED PERFECTLY!');
    process.exit(0);
  } else {
    console.error('Some tests failed!');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
