const express = require('express');
const cartModel = require('../models/cart.model');
const courseModel = require('../models/course.model');
const wishModel = require('../models/wish.model');
const auth = require('../middlewares/auth.mdw');
const ownedModel = require('../models/owned.model');

const router = express.Router();

router.get('/', auth.user, async function (req, res) {
    let originalprice = 0;
    let promotionalprice = 0;
    let cartID = await cartModel.cartByUsername(req.session.profile.username);
    let courseCart = [];
    if (cartID.length === 0) {
        courseCart = null;
    }

    for (let i = 0; i < cartID.length; i++) {
        let courseItem = await courseModel.singleByID(cartID[i].courseid);
        originalprice = originalprice + courseItem.originalprice;
        promotionalprice = promotionalprice + courseItem.promotionalprice;
        courseCart.push(courseItem);
    }

    res.render('vwUser/cart', {
        forUser: true,
        cart: courseCart,
        promotionalprice,
        originalprice,
    });
});

router.post('/', auth.user, async function (req, res) {
    let courseid = req.body.id;
    let postid = req.body.postid;
    if (postid === "remove") {
        cartModel.deleteByCourseID(courseid);
        return res.redirect(req.headers.referer);
    }
    if (postid === "wishlist") {
        let wishExist = await wishModel.isExist(req.session.profile.username, courseid);
        if (wishExist) {
            cartModel.deleteByCourseID(courseid);
            return res.redirect(req.headers.referer);
        }
        newWish = {
            studentid: req.session.profile.username,
            courseid: courseid,
        }
        wishModel.add(newWish);
        cartModel.deleteByCourseID(courseid);
        return res.redirect(req.headers.referer);
    }

    if (postid === "checkout") {
        let cart = await cartModel.cartByUsername(req.session.profile.username);
        if (cart.length === 0) {
            return res.redirect(req.headers.referer);
        }

        for (i = 0; i < cart.length; i++) {
            let courseid = cart[i].courseid;
            let is_exist = await ownedModel.isExist(courseid, req.session.profile.username);
            console.log(is_exist);
            if (is_exist === false) {
                let dateNow = new Date().toISOString().slice(0, 19).replace('T', ' ');
                newOwned = {
                    userid: req.session.profile.username,
                    courseid,
                    date: dateNow,
                }
                ownedModel.add(newOwned);
                courseModel.addOneStudentByID(courseid);
            }

            await cartModel.deleteByCourseID(courseid);
        }
        return res.redirect(req.headers.referer);
    }
});

router.post('/add', auth.user, async function (req, res) {
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