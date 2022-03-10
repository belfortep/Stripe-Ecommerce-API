const User = require('../models/User');
const router = require('express').Router();
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config()

//REGISTER

router.post('/register', async (req, res) => {



    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_PHRASE).toString()      //objeto CryptoJS, .AES manera en la que se encripta
    })
    try {

        const savedUser = await newUser.save()

        res.status(201).json(savedUser)

    } catch (err) {

        res.status(500).json(err)

    }

});

router.post('/login', async (req, res) => {
    try {

        const user = await User.findOne({ username: req.body.username })

        if (!user) {
            res.status(401).json("Wrong Credentials")
            return
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_PHRASE);

        const dbPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if (dbPassword !== req.body.password) {
            res.status(401).json('Wrong Credentials')
            return
        }

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        //esta linea de codigo es para no enviar la password como respuesta
        const { password, ...others } = user._doc;  //._doc porque es ahi donde mongoDB guarda los datos

        res.status(200).json({ ...others, accessToken });


    } catch (err) {
        res.status(500).json(err)
        return
    }


})



module.exports = router