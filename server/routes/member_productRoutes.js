const express = require("express");
const router = express.Router();
const member_productController = require("../controllers/member_productController");

// Route to get all member-product relations
router.get("/", member_productController.getAllMemberProducts);

// Route to get products by member ID
router.get("/:memberId", member_productController.getMemberProductsByMemberId);

// Route to get members by product ID
router.get("/:productId", member_productController.getMemberProductsByProductId);

// Route to create a new member-product relation
router.post("/create", member_productController.createMemberProduct);

// Route to delete a member-product relation
router.delete("/:memberId/:productId", member_productController.deleteMemberProduct);

module.exports = router;