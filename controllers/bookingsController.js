// controllers/bankingController.js
const { Account, Transaction, Card, Loan, Beneficiary } = require('../models');

// ============= ACCOUNTS =============
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      where: { userId: req.user.id }
    });
    res.json({ accounts });
  } catch (error) {
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
    res.status(500).json({ error: 'Failed to fetch account' });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const account = await Account.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json({ message: 'Account created', account });
  } catch (error) {
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
    res.json({ message: 'Account updated', account });
  } catch (error) {
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
    res.json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

exports.getAccountBalance = async (req, res) => {
  try {
    const account = await Account.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json({ balance: account.balance, currency: account.currency });
  } catch (error) {
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
    const transactions = await Transaction.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json({ message: 'Transaction created', transaction });
  } catch (error) {
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
    res.json({ transactions });
  } catch (error) {
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
    res.status(500).json({ error: 'Failed to fetch card' });
  }
};

exports.createCard = async (req, res) => {
  try {
    const card = await Card.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json({ message: 'Card created', card });
  } catch (error) {
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
    res.json({ message: 'Card updated', card });
  } catch (error) {
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
    res.json({ message: 'Card activated', card });
  } catch (error) {
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
    res.json({ message: 'Card blocked', card });
  } catch (error) {
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
    res.json({ message: 'Card deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete card' });
  }
};

// ============= LOANS =============
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { userId: req.user.id }
    });
    res.json({ loans });
  } catch (error) {
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
    res.status(500).json({ error: 'Failed to fetch loan' });
  }
};

exports.applyForLoan = async (req, res) => {
  try {
    const loan = await Loan.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json({ message: 'Loan application submitted', loan });
  } catch (error) {
    res.status(400).json({ error: 'Failed to apply for loan' });
  }
};

exports.updateLoanStatus = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    loan.status = req.body.status;
    await loan.save();
    res.json({ message: 'Loan status updated', loan });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update loan status' });
  }
};

exports.makeLoanPayment = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    // Payment logic here
    loan.outstandingBalance -= req.body.amount;
    await loan.save();
    res.json({ message: 'Payment successful', loan });
  } catch (error) {
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
    res.status(500).json({ error: 'Failed to fetch beneficiaries' });
  }
};

exports.addBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json({ message: 'Beneficiary added', beneficiary });
  } catch (error) {
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
    res.json({ message: 'Beneficiary updated', beneficiary });
  } catch (error) {
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
    res.json({ message: 'Beneficiary deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete beneficiary' });
  }
};

// ============= TRANSFERS =============
exports.createTransfer = async (req, res) => {
  try {
    const { fromAccountId, toAccountId, amount, description } = req.body;
    // Create transfer transactions
    await Transaction.create({
      accountId: fromAccountId,
      transactionType: 'transfer',
      amount,
      description,
      toAccountId
    });
    res.status(201).json({ message: 'Transfer initiated' });
  } catch (error) {
    res.status(400).json({ error: 'Transfer failed' });
  }
};

exports.getTransferStatus = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transfer not found' });
    res.json({ status: transaction.status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transfer status' });
  }
};