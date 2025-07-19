const express = require ("express")
const { authMiddleware } = require("../middleware.cjs");
const { Account } = require('../db.cjs')
const mongoose = require('mongoose');//mongoose - for transactions

const router = express.Router();

//route to get the balance-

router.get("/balance", authMiddleware, async(req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });
    res.json({
        balance: account.balance
    })
})

//transfer code (most critical part of the codebase):

// Replace the old /transfer route with this one

router.post("/transfer", authMiddleware, async (req, res) => {
    const { amount, to } = req.body;

    const account = await Account.findOne({
        userId: req.userId
    });

    if (account.balance < amount) {
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({
        userId: to
    });

    if (!toAccount) {
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer (without a transaction)
    await Account.updateOne({
        userId: req.userId
    }, {
        $inc: {
            balance: -amount
        }
    });

    await Account.updateOne({
        userId: to
    }, {
        $inc: {
            balance: amount
        }
    });

    res.json({
        message: "Transfer successful"
    });
});




module.exports = router;