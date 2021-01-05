const express = require('express');
const cartModel = require('../models/cart.model');
const auth = require('../middlewares/auth.mdw');

const router = express.Router();

router.get('/', auth, async function (req, res) {
    let cart = await cartModel.cartByUsername(req.session.profile.username);
    res.render('vwUser/cart', {
        forUser: true,
        cart,
    });
});

router.post('/add', async function (req, res) {
    const courseId = req.body.id;
    let cart_exist = await cartModel.isExist(req.session.profile.username, courseId);
    if (cart_exist) {
        console.log("CART EXIST!");
        return res.redirect(req.headers.referer);
    }

    newCartItem = {
        studentid: req.session.profile.username,
        courseid: courseId,
    }

    cartModel.addCourse(newCartItem);
    res.redirect(req.headers.referer);
});

module.exports = router;