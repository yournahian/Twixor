const db = require('../../backend/config/db');

async function test() {
  const pay = await db.getPaymentConfig();
  console.log('1. Payment Config loaded:', Boolean(pay && pay.bKash && pay.cryptoAddresses));

  const order = await db.recordTransaction({
    user: '@yournahian',
    handle: '@yournahian',
    email: 'nahian@example.com',
    credits: 5000,
    amount: '৳1,250 BDT',
    currency: 'BDT',
    method: 'bKash',
    trxId: 'TEST-9X7A2K9L',
    status: 'PENDING'
  });
  console.log('2. Order created:', order.id, order.status);

  const userOrders = await db.getTransactionsByUser('yournahian');
  console.log('3. User orders retrieved:', userOrders.length, 'orders. First status:', userOrders[0]?.status);

  const approved = await db.updateTransactionStatus(order.id, 'APPROVED', 'Approved via automated test');
  console.log('4. Order approved status:', approved.status);
}
test();
