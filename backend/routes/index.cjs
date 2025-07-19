
//THIS IS THE MAIN ROUTER FOR ALL (the Root router)

const express = require('express');

const userRouter = require("./user.cjs") //importing the userRouter created in the user.js

const accountRouter = require("./account.cjs")

//create a mini router
const router = express.Router()

router.use("/user", userRouter); //(main part) - it says if any url request comes for /user, do not handle it, instead, delegate it to the userRouter ane let it handle it.

router.use("/account", accountRouter);

//export it so index.js(the main one) can use it
module.exports = router;
