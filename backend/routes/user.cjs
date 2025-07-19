
//THIS IS THE USER DEPARTMENT 
//this is where the userRouter points to


const express = require ("express")
const router = express.Router(); //creating a specialised "mini router" to only handle user-related endpoints


const zod = require("zod");
const { User, Account } = require("../db.cjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.cjs");
const { authMiddleware } = require("../middleware.cjs");





//zod schema for signup:
const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

//Signup route
router.post("/signup", async (req, res) => {
    //it is async because database operations take time and we need to await their completion

    //1. input validation
    const {success} = signupBody.safeParse(req.body)
    if(!success) {
        return res.status(411).json({
            message:"Email already taken / incorrect inputs"
        })
    }

    //2. check for existing user
    const existingUser = await User.findOne({
        username: req.body.username
    })
    if(existingUser){
        return res.status(411).json({
            message: "Email already taken / incorrect inputs"
        })
    }
    //3. create the user in the database
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })
    const userId = user._id;


    //give the user a random number as balance (transactions part)
    await Account.create({
        userId,
        balance: 1 + Math.random() * 1000
    })

    //4. Generate a jwt
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    //5.Send the success response
    res.json({
        message: "User created successfully",
        token: token
    })

})

//THE SIGN-IN CODE:

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

//sign-in route-
router.post('/signin', async(req, res) => {

    //1. input validation-
    const { success } = signinBody.safeParse(req.body);
    if(!success) {
        res.status(411).json({
            message: "email already taken or incorrect credentials"
        })
    }

    //2. find the user in the database-
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if(user){
        //3. if user exists, grant a token
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return
    }

    //4. if user doesnt exist, send an error message-
    res.status(411).json({
        message: "error while logging in"
    })
})

//zod schema for updates
const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

router.put("/", authMiddleware, async(req, res) => {
    //1. validate inputs - 
    const { success } = updateBody.safeparse(req.body)
    if(!success){
        res.status(411).json({
            message: "error while updating information"
        })
    }
    //2. update the user's data
    await User.updateOne({_id: req.userId }, req.body);

    res.json({
        message: "updated successfully"
    })
})

//the "search for users" route-
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find( {
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }
    ]
    })
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports = router;