const express = require('express');
const auth = require('../../middlewares/auth.mdw');
const wishModel = require('../../models/wish.model');
const router = express.Router();

router.get('/', auth.user, async function (req, res) {
    let wish = await wishModel.singleByUsername(req.session.profile.username);
    console.log(wish);
    res.render('vwUser/wish', {
        forUser: true,
        wish,
    });
});

router.post('/', auth.user, function (req, res) {
    wishModel.deleteByCourseID(req.body.id);
    return res.redirect(req.headers.referer);
});

router.post('/add', auth.user, async function (req, res) {
    const courseId = req.body.id;
    let wish_exist = await wishModel.isExist(req.session.profile.username, courseId);
    if (wish_exist) {
        console.log("CART EXIST!");
        return res.redirect(req.headers.referer);
    }
    newWish = {
        studentid: req.session.profile.username,
        courseid: courseId,
    }
    wishModel.add(newWish);
    res.redirect(req.headers.referer);
});

module.exports = router;