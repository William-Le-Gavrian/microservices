const router = require("express").Router();
const cartController = require("../controllers/cart");

router.post("/", cartController.createCart);
router.get("/", cartController.getCart);
router.post("/:productId", cartController.addItemToCart);
router.delete("/:productId", cartController.removeItemFromCart);

module.exports = router;