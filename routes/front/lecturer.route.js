const express = require('express');
const bcrypt = require('bcryptjs');
const lecturerModel = require('../../models/lecturer.model');

const router = express.Router();
router.get('/', function (req, res) {
    res.render('vwLecturer/home');
    req.session.permission = 1;
})
router.get('/log-in', function (req, res) {
    res.render('vwLecturer/log-in');
});

router.get('/sign-up', function (req, res) {
    res.render('vwLecturer/sign-up');
});

router.get('/sign-out', function (req, res) {
    req.session.authUser = null;
    req.session.permission = -1;
    req.session.isAuth = false;

    let url = '/lecturer';
    res.redirect(url);
});

router.post('/log-in', async function (req, res) {
    console.log(req.body);
    const result = await lecturerModel.singleByUsername(req.body.username);
    if (result == null) {
        return res.render('vwLecturer/log-in', {
            err_message: 'There was a problem logging in. Check your email and password or create an account.',
        });
    }
    const correctPassword = bcrypt.compareSync(req.body.password, result.password);
    console.log(correctPassword);
    if (correctPassword == false) {
        return res.render('vwLecturer/log-in', {
            err_message: 'There was a problem logging in. Check your email and password or create an account.',
        });
    }
    req.session.username = result.username;
    req.session.name = result.name;
    req.session.permission = 1;
    req.session.isAuth = true;

    let url = '/';
    res.redirect('/');
});

router.post('/sign-up', async function (req, res) {
    const result = await lecturerModel.singleByUsername(req.body.username);
    console.log(req.body);
    if (result) {
        return res.render('vwtLecturer/log-in', {
            err_message: 'This account already exists. Please login or enter another account.',
        });
    }

    const newLecturer = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        name: req.body.name,
        email: req.body.email,
        bankid: req.body.bankid,
        bankname: req.body.bankname,
    }

    lecturerModel.add(newLecturer);
    // res.redirect('/lecturer')
});

module.exports = router;