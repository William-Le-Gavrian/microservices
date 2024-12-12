const router = require("express").Router();
const cartController = require("../controllers/cart");

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management
 */

/**
 * @swagger
 * /api/cart:
 *  get:
 *      description: Returns the content of the cart
 *      responses:
 *          200:
 *              description: Cart returned successfully
 *          404:
 *              description: Cart not found
 *          500:
 *              description: Server error
 */
router.get("/", cartController.getCart);

/**
 * @swagger
 * /api/cart/{productId}:
 *   post:
 *     description: Add a product to the user's cart
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the product to add
 *     responses:
 *       200:
 *         description: Product add successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: server error
 */
router.post("/:productId", cartController.addItemToCart);

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     description: Delete an item in the cart by specifying its ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete("/:productId", cartController.removeItemFromCart);

module.exports = router;