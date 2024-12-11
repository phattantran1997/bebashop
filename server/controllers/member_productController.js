const member_productModel = require("../models/member_productModel");

exports.getAllMemberProducts = (req, res) => {
    member_productModel.getAllMemberProducts()
        .then(memberProducts => {
            res.json(memberProducts);
        })
        .catch(error => {
            console.error("Error fetching member products:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};

exports.getMemberProductsByMemberId = (req, res) => {
    const memberId = req.params.memberId;
    member_productModel.getMemberProductsByMemberId(memberId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error fetching member products.");
        });
};

exports.getMemberProductsByProductId = (req, res) => {
    const productId = req.params.productId;
    member_productModel.getMemberProductsByProductId(productId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error fetching member products.");
        });
};

exports.createMemberProduct = (req, res) => {
    const { memberId, productId, price, discount } = req.body;
    member_productModel.createMemberProduct(memberId, productId, price, discount)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error creating member product relation.");
        });
};

exports.deleteMemberProduct = (req, res) => {
    const { memberId, productId, price, discount } = req.params;
    member_productModel.deleteMemberProduct(memberId, productId, price, discount)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send("Error deleting member product relation.");
        });
};