const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../Models/User_Model');
const JWT_AUTH = require('../middlewares/JWT');
const jwt = require('jsonwebtoken')

router.post('/register-user', async (req, res) => {


    try {

        console.log(req.body);

        const isUserExisting = await User.find({ email: req.body.userDetails.email })

        if (isUserExisting.length) {
            console.log("user already exists");
            return res.status(400).json({ error: `User ${req.body.userDetails.email} already exists` })
        }

        console.log(isUserExisting);

        const hashedPassword = await bcrypt.hash(req.body.userDetails.password, 10);

        req.body.userDetails.password = hashedPassword

        const newUser = await User(req.body.userDetails)

        await newUser.save()

        return res.json("data is recieved")



    } catch (error) {
        console.log(error);

    }


})


router.post('/login-user', async (req, res) => {
    try {
        const isUserExisting = await User.findOne({ email: req.body.userDetails.email });

        if (!isUserExisting) {
            return res.status(404).json({ error: "User not found" });
        }

        const match = await bcrypt.compare(req.body.userDetails.password, isUserExisting.password);

        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const payload = {
            userId: isUserExisting._id,
            email: isUserExisting.email
            // Add any other relevant user information here
        };

        const token = jwt.sign(payload, process.env.SECRET);
        return res.status(200).json({ token: token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});



router.get('/test', JWT_AUTH, async (req, res) => {
    try {
        res.json("success")
    } catch (error) {
        res.json("error")

    }
})



module.exports = router