// routes/ecommerceRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');
const {
  // Products
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
  // Categories
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  // Cart
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  // Orders
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  // Reviews
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  // Wishlist
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/ecommerceController');

// ============= PRODUCTS ROUTES =============

/**
 * @swagger
 * /api/v1/ecommerce/products:
 *   get:
 *     summary: Get all products
 *     tags: [E-commerce - Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name/description
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, name_asc, name_desc, newest]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/products', optionalAuth, getAllProducts);
router.head('/products', optionalAuth, getAllProducts);

/**
 * @swagger
 * /api/v1/ecommerce/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [E-commerce - Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/products/:id', optionalAuth, getProductById);
router.head('/products/:id', optionalAuth, getProductById);

/**
 * @swagger
 * /api/v1/ecommerce/products:
 *   post:
 *     summary: Create a new product
 *     tags: [E-commerce - Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               comparePrice:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               stock:
 *                 type: integer
 *               sku:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Product created
 *       401:
 *         description: Unauthorized
 */
router.post('/products', authenticate, createProduct);

/**
 * @swagger
 * /api/v1/ecommerce/products/{id}:
 *   put:
 *     summary: Update product (full update)
 *     tags: [E-commerce - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.put('/products/:id', authenticate, updateProduct);

/**
 * @swagger
 * /api/v1/ecommerce/products/{id}:
 *   patch:
 *     summary: Update product (partial update)
 *     tags: [E-commerce - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product updated
 */
router.patch('/products/:id', authenticate, patchProduct);

/**
 * @swagger
 * /api/v1/ecommerce/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [E-commerce - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete('/products/:id', authenticate, deleteProduct);

router.options('/products', (req, res) => res.sendStatus(200));
router.options('/products/:id', (req, res) => res.sendStatus(200));

// ============= CATEGORIES ROUTES =============
router.get('/categories', getAllCategories);
router.get('/categories/:id', getCategoryById);
router.post('/categories', authenticate, createCategory);
router.put('/categories/:id', authenticate, updateCategory);
router.patch('/categories/:id', authenticate, updateCategory);
router.delete('/categories/:id', authenticate, deleteCategory);
router.options('/categories', (req, res) => res.sendStatus(200));

// ============= CART ROUTES =============
router.get('/cart', authenticate, getCart);
router.post('/cart', authenticate, addToCart);
router.put('/cart/:itemId', authenticate, updateCartItem);
router.patch('/cart/:itemId', authenticate, updateCartItem);
router.delete('/cart/:itemId', authenticate, removeFromCart);
router.delete('/cart', authenticate, clearCart);
router.options('/cart', (req, res) => res.sendStatus(200));

// ============= ORDERS ROUTES =============
router.get('/orders', authenticate, getAllOrders);
router.get('/orders/:id', authenticate, getOrderById);
router.post('/orders', authenticate, createOrder);
router.put('/orders/:id/status', authenticate, updateOrderStatus);
router.patch('/orders/:id/cancel', authenticate, cancelOrder);
router.delete('/orders/:id', authenticate, cancelOrder);
router.options('/orders', (req, res) => res.sendStatus(200));

// ============= REVIEWS ROUTES =============
router.get('/products/:productId/reviews', getProductReviews);
router.post('/products/:productId/reviews', authenticate, createReview);
router.put('/reviews/:id', authenticate, updateReview);
router.patch('/reviews/:id', authenticate, updateReview);
router.delete('/reviews/:id', authenticate, deleteReview);
router.options('/products/:productId/reviews', (req, res) => res.sendStatus(200));

// ============= WISHLIST ROUTES =============
router.get('/wishlist', authenticate, getWishlist);
router.post('/wishlist', authenticate, addToWishlist);
router.delete('/wishlist/:productId', authenticate, removeFromWishlist);
router.options('/wishlist', (req, res) => res.sendStatus(200));

module.exports = router;