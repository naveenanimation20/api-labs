// routes/bankingRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  // Accounts
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountBalance,
  // Transactions
  getAllTransactions,
  getTransactionById,
  createTransaction,
  getAccountStatement,
  // Cards
  getAllCards,
  getCardById,
  createCard,
  updateCard,
  activateCard,
  blockCard,
  deleteCard,
  // Loans
  getAllLoans,
  getLoanById,
  applyForLoan,
  updateLoanStatus,
  makeLoanPayment,
  // Beneficiaries
  getAllBeneficiaries,
  addBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
  // Transfers
  createTransfer,
  getTransferStatus
} = require('../controllers/bankingController');

// ============= ACCOUNTS ROUTES =============

/**
 * @swagger
 * /api/v1/banking/accounts:
 *   get:
 *     summary: Get all user accounts
 *     tags: [Banking - Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of accounts
 */
router.get('/accounts', authenticate, getAllAccounts);
router.head('/accounts', authenticate, getAllAccounts);

router.get('/accounts/:id', authenticate, getAccountById);
router.post('/accounts', authenticate, createAccount);
router.put('/accounts/:id', authenticate, updateAccount);
router.patch('/accounts/:id', authenticate, updateAccount);
router.delete('/accounts/:id', authenticate, deleteAccount);
router.get('/accounts/:id/balance', authenticate, getAccountBalance);
router.options('/accounts', (req, res) => res.sendStatus(200));

// ============= TRANSACTIONS ROUTES =============

/**
 * @swagger
 * /api/v1/banking/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Banking - Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: accountId
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [debit, credit, transfer]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/transactions', authenticate, getAllTransactions);
router.head('/transactions', authenticate, getAllTransactions);

router.get('/transactions/:id', authenticate, getTransactionById);
router.post('/transactions', authenticate, createTransaction);
router.get('/accounts/:id/statement', authenticate, getAccountStatement);
router.options('/transactions', (req, res) => res.sendStatus(200));

// ============= CARDS ROUTES =============

router.get('/cards', authenticate, getAllCards);
router.get('/cards/:id', authenticate, getCardById);
router.post('/cards', authenticate, createCard);
router.put('/cards/:id', authenticate, updateCard);
router.patch('/cards/:id', authenticate, updateCard);
router.patch('/cards/:id/activate', authenticate, activateCard);
router.patch('/cards/:id/block', authenticate, blockCard);
router.delete('/cards/:id', authenticate, deleteCard);
router.options('/cards', (req, res) => res.sendStatus(200));

// ============= LOANS ROUTES =============

router.get('/loans', authenticate, getAllLoans);
router.get('/loans/:id', authenticate, getLoanById);
router.post('/loans', authenticate, applyForLoan);
router.put('/loans/:id/status', authenticate, updateLoanStatus);
router.patch('/loans/:id/status', authenticate, updateLoanStatus);
router.post('/loans/:id/payment', authenticate, makeLoanPayment);
router.options('/loans', (req, res) => res.sendStatus(200));

// ============= BENEFICIARIES ROUTES =============

router.get('/beneficiaries', authenticate, getAllBeneficiaries);
router.post('/beneficiaries', authenticate, addBeneficiary);
router.put('/beneficiaries/:id', authenticate, updateBeneficiary);
router.patch('/beneficiaries/:id', authenticate, updateBeneficiary);
router.delete('/beneficiaries/:id', authenticate, deleteBeneficiary);
router.options('/beneficiaries', (req, res) => res.sendStatus(200));

// ============= TRANSFERS ROUTES =============

router.post('/transfers', authenticate, createTransfer);
router.get('/transfers/:id/status', authenticate, getTransferStatus);
router.options('/transfers', (req, res) => res.sendStatus(200));

module.exports = router;