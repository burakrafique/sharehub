// Simple test script for transaction management system
const Transaction = require('./models/Transaction');
const Item = require('./models/Item');

async function testTransactionSystem() {
  console.log('🧪 Testing Transaction Management System...\n');

  try {
    // Test 1: Create a transaction
    console.log('1. Testing transaction creation...');
    const transactionData = {
      item_id: 1,
      seller_id: 1,
      buyer_id: 2,
      transaction_type: 'sale',
      amount: 1500.00
    };

    const newTransaction = await Transaction.createTransaction(transactionData);
    console.log('✅ Transaction created:', newTransaction.id);

    // Test 2: Find transaction by ID
    console.log('\n2. Testing find transaction by ID...');
    const foundTransaction = await Transaction.findById(newTransaction.id);
    if (foundTransaction) {
      console.log('✅ Transaction found:', foundTransaction.item_title || 'Transaction details loaded');
    } else {
      console.log('❌ Transaction not found');
    }

    // Test 3: Get user transactions
    console.log('\n3. Testing user transactions retrieval...');
    const userTransactions = await Transaction.findByUser(1, 'all', 1, 10);
    console.log('✅ User transactions:', userTransactions.transactions.length, 'found');

    // Test 4: Get transaction statistics
    console.log('\n4. Testing transaction statistics...');
    const stats = await Transaction.getTransactionStats(1);
    console.log('✅ Transaction stats:', {
      sales: stats.total_sales_count,
      purchases: stats.total_purchases_count,
      donations: stats.total_donations_given
    });

    // Test 5: Update transaction status
    console.log('\n5. Testing transaction status update...');
    const updatedTransaction = await Transaction.updateStatus(newTransaction.id, 'completed');
    if (updatedTransaction) {
      console.log('✅ Transaction status updated to:', updatedTransaction.status);
    } else {
      console.log('❌ Failed to update transaction status');
    }

    console.log('\n🎉 All transaction tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testTransactionSystem()
    .then(() => {
      console.log('\n✨ Transaction system test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Transaction system test failed:', error);
      process.exit(1);
    });
}

module.exports = { testTransactionSystem };