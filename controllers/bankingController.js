// controllers/bankingController.js
const { Op } = require('sequelize');
const { Account, Transaction, Card, Loan, Beneficiary } = require('../models');

// ============= ACCOUNTS =============
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      where: { userId: req.user.id }
    });
    res.json({ accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
};

exports.getAccountById = async (req, res) => {
  try {
    const account = await Account.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json({ account });
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const account = await Account.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json({ message: 'Account created successfully', account });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(400).json({ error: 'Failed to create account' });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    await account.update(req.body);
    res.json({ message: 'Account updated successfully', account });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(400).json({ error: 'Failed to update account' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    await account.destroy();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

exports.getAccountBalance = async (req, res) => {
  try {
    const account = await Account.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json({ 
      balance: account.balance, 
      currency: account.currency,
      accountNumber: account.accountNumber
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
};

// ============= TRANSACTIONS =============
exports.getAllTransactions = async (req, res) => {
  try {
    const { accountId, type, startDate, endDate } = req.query;
    const where = {};
    
    if (accountId) where.accountId = accountId;
    if (type) where.transactionType = type;
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const transactions = await Transaction.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 100
    });

    res.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    
    // Real-time notification
    const io = req.app.get('io');
    io.to(`account_${transaction.accountId}`).emit('transaction_created', transaction);

    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(400).json({ error: 'Failed to create transaction' });
  }
};

exports.getAccountStatement = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { accountId: req.params.id },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    const account = await Account.findByPk(req.params.id);
    if (!account) return res.status(404).json({ error: 'Account not found' });

    res.json({ 
      account: {
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        balance: account.balance
      },
      transactions 
    });
  } catch (error) {
    console.error('Get statement error:', error);
    res.status(500).json({ error: 'Failed to fetch statement' });
  }
};

// ============= CARDS =============
exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.findAll({
      where: { userId: req.user.id }
    });
    res.json({ cards });
  } catch (error) {
    console.error('Get cards error:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
};

exports.getCardById = async (req, res) => {
  try {
    const card = await Card.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json({ card });
  } catch (error) {
    console.error('Get card error:', error);
    res.status(500).json({ error: 'Failed to fetch card' });
  }
};

exports.createCard = async (req, res) => {
  try {
    const card = await Card.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json({ message: 'Card created successfully', card });
  } catch (error) {
    console.error('Create card error:', error);
    res.status(400).json({ error: 'Failed to create card' });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const card = await Card.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    await card.update(req.body);
    res.json({ message: 'Card updated successfully', card });
  } catch (error) {
    console.error('Update card error:', error);
    res.status(400).json({ error: 'Failed to update card' });
  }
};

exports.activateCard = async (req, res) => {
  try {
    const card = await Card.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    
    card.status = 'active';
    await card.save();
    
    res.json({ message: 'Card activated successfully', card });
  } catch (error) {
    console.error('Activate card error:', error);
    res.status(500).json({ error: 'Failed to activate card' });
  }
};

exports.blockCard = async (req, res) => {
  try {
    const card = await Card.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    
    card.status = 'blocked';
    await card.save();
    
    res.json({ message: 'Card blocked successfully', card });
  } catch (error) {
    console.error('Block card error:', error);
    res.status(500).json({ error: 'Failed to block card' });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    await card.destroy();
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Delete card error:', error);
    res.status(500).json({ error: 'Failed to delete card' });
  }
};

// ============= LOANS =============
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json({ loans });
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
};

exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    res.json({ loan });
  } catch (error) {
    console.error('Get loan error:', error);
    res.status(500).json({ error: 'Failed to fetch loan' });
  }
};

exports.applyForLoan = async (req, res) => {
  try {
    const loan = await Loan.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json({ message: 'Loan application submitted successfully', loan });
  } catch (error) {
    console.error('Apply for loan error:', error);
    res.status(400).json({ error: 'Failed to apply for loan' });
  }
};

exports.updateLoanStatus = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    
    loan.status = req.body.status;
    await loan.save();
    
    // Real-time notification
    const io = req.app.get('io');
    io.to(`user_${loan.userId}`).emit('loan_status_updated', { loanId: loan.id, status: loan.status });
    
    res.json({ message: 'Loan status updated successfully', loan });
  } catch (error) {
    console.error('Update loan status error:', error);
    res.status(400).json({ error: 'Failed to update loan status' });
  }
};

exports.makeLoanPayment = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    
    const paymentAmount = parseFloat(req.body.amount);
    if (paymentAmount > loan.outstandingBalance) {
      return res.status(400).json({ error: 'Payment amount exceeds outstanding balance' });
    }

    loan.outstandingBalance -= paymentAmount;
    if (loan.outstandingBalance === 0) {
      loan.status = 'paid';
    }
    await loan.save();
    
    res.json({ message: 'Payment successful', loan });
  } catch (error) {
    console.error('Make loan payment error:', error);
    res.status(400).json({ error: 'Failed to make payment' });
  }
};

// ============= BENEFICIARIES =============
exports.getAllBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.findAll({
      where: { userId: req.user.id }
    });
    res.json({ beneficiaries });
  } catch (error) {
    console.error('Get beneficiaries error:', error);
    res.status(500).json({ error: 'Failed to fetch beneficiaries' });
  }
};

exports.addBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json({ message: 'Beneficiary added successfully', beneficiary });
  } catch (error) {
    console.error('Add beneficiary error:', error);
    res.status(400).json({ error: 'Failed to add beneficiary' });
  }
};

exports.updateBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!beneficiary) return res.status(404).json({ error: 'Beneficiary not found' });
    await beneficiary.update(req.body);
    res.json({ message: 'Beneficiary updated successfully', beneficiary });
  } catch (error) {
    console.error('Update beneficiary error:', error);
    res.status(400).json({ error: 'Failed to update beneficiary' });
  }
};

exports.deleteBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!beneficiary) return res.status(404).json({ error: 'Beneficiary not found' });
    await beneficiary.destroy();
    res.json({ message: 'Beneficiary deleted successfully' });
  } catch (error) {
    console.error('Delete beneficiary error:', error);
    res.status(500).json({ error: 'Failed to delete beneficiary' });
  }
};

// ============= TRANSFERS =============
exports.createTransfer = async (req, res) => {
  try {
    const { fromAccountId, toAccountId, amount, description } = req.body;

    // Validate accounts
    const fromAccount = await Account.findOne({
      where: { id: fromAccountId, userId: req.user.id }
    });
    if (!fromAccount) {
      return res.status(404).json({ error: 'Source account not found' });
    }

    const toAccount = await Account.findByPk(toAccountId);
    if (!toAccount) {
      return res.status(404).json({ error: 'Destination account not found' });
    }

    // Check sufficient balance
    if (fromAccount.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create transfer transactions
    const debitTransaction = await Transaction.create({
      accountId: fromAccountId,
      transactionType: 'transfer',
      amount,
      description: description || `Transfer to ${toAccount.accountNumber}`,
      toAccountId,
      status: 'completed',
      balanceAfter: fromAccount.balance - amount
    });

    const creditTransaction = await Transaction.create({
      accountId: toAccountId,
      transactionType: 'transfer',
      amount,
      description: description || `Transfer from ${fromAccount.accountNumber}`,
      status: 'completed',
      balanceAfter: toAccount.balance + parseFloat(amount)
    });

    // Update balances
    fromAccount.balance -= parseFloat(amount);
    toAccount.balance += parseFloat(amount);
    await fromAccount.save();
    await toAccount.save();

    // Real-time notification
    const io = req.app.get('io');
    io.to(`user_${req.user.id}`).emit('transfer_completed', { transaction: debitTransaction });
    io.to(`user_${toAccount.userId}`).emit('transfer_received', { transaction: creditTransaction });

    res.status(201).json({ 
      message: 'Transfer initiated successfully',
      debitTransaction,
      creditTransaction
    });
  } catch (error) {
    console.error('Create transfer error:', error);
    res.status(400).json({ error: 'Transfer failed' });
  }
};

exports.getTransferStatus = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transfer not found' });
    res.json({ 
      status: transaction.status,
      referenceNumber: transaction.referenceNumber,
      amount: transaction.amount,
      createdAt: transaction.createdAt
    });
  } catch (error) {
    console.error('Get transfer status error:', error);
    res.status(500).json({ error: 'Failed to fetch transfer status' });
  }
};