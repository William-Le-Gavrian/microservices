const router = require("express").Router();
const productController = require("../controllers/product");

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Add a new product to the catalog.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                  type: string
 *               stock:
 *                 type: integer
 *             required:
 *               - name
 *               - price
 *               - category
 *               - stock
 *     responses:
 *       200:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post("/", productController.createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products.
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   category:
 *                      type: string
 *                   stock:
 *                     type: integer
 *       404:
 *          description: Products not found
 *       500:
 *          description: Server error
 */
router.get("/", productController.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product
 *     description: Retrieve the details of a single product by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *                 category:
 *                      type: string
 *                 stock:
 *                   type: integer
 *       404:
 *          description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/:id", productController.getOneProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     description: Update the details of an existing product.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put("/:id", productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Remove a product from the catalog by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to delete
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", productController.deleteProduct);

module.exports = router;