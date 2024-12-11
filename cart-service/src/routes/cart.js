const router = require('express').Router();
const cartController = require('../controllers/cart');
const { verifyToken } = require('../middleware/jwt');

// router.post("/", verifyToken, cartController.createCart);
router.get('/', verifyToken, cartController.getCart);
router.post('/:productId', verifyToken, cartController.addItemToCart);
router.delete('/:productId', verifyToken, cartController.removeItemFromCart);

module.exports = router;
