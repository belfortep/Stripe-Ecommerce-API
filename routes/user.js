const User = require('../models/User');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const router = require('express').Router();



//UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {

    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_PHRASE).toString()
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedUser)
    } catch (err) {
        return res.status(500).json(err)
    }

})

//DELETE

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)

        res.status(200).json('User deleted')

    } catch (err) {
        return res.status(500).json(err)
    }
})

//GET USER
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        const { password, ...others } = user._doc

        res.status(200).json(...others)

    } catch (err) {
        return res.status(500).json(err)
    }
})

//GET ALL USERS

router.get('/', verifyTokenAndAdmin, async (req, res) => {

    const query = req.query.new

    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find(); //si esta query "new", devolveme los primeros 5 usuarios

        res.status(200).json(users)

    } catch (err) {
        return res.status(500).json(err)
    }
})


//GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {

    const date = new Date();

    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {

        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },  //buscame los usuarios que se registraran antes de la variable lastYear
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: "$month",  //agrupados los elementos por los meses, aca me da el id del mes. digamos que tengo 4 usuarios registrados en noviembre, entonces me devuelve id:11
                    total: { $sum: 1 }//aca consigo la cantidad total de usuarios, siguiendo lo anterior me tendria que dar 4
                }
            }
        ])

        res.status(200).json(data)

    } catch (err) {
        return res.status(500).json(err)
    }

})


module.exports = router