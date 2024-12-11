const express = require("express");
const router = express.Router();
    const memberController = require("../controllers/memberController.js");

    // Create a new Member
    router.post("/create", memberController.create);

    // Retrieve all Members
    router.get("/", memberController.findAll);

    // Retrieve a single Member with memberId
    router.get("/:memberId", memberController.findOne);

    // Update a Member with memberId
    router.put("/:memberId", memberController.update);

    // Delete a Member with memberId
    router.delete("/:memberId/:productId", memberController.delete);

    module.exports = router;
