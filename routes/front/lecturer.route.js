const express = require('express');
const bcrypt = require('bcryptjs');
const lecturerModel = require('../../models/lecturer.model');

const router = express.Router();

router.get('/log-in', function (req, res) {
    res.render('vwLecturer/log-in', {
        forLecturer: true,
    });
});

router.get('/sign-up', function (req, res) {
    res.render('vwLecturer/sign-up', {
        forLecturer: true,
    });
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
            forLecturer: true,
        });
    }
    const correctPassword = bcrypt.compareSync(req.body.password, result.password);
    console.log(correctPassword);
    if (correctPassword == false) {
        return res.render('vwLecturer/log-in', {
            err_message: 'There was a problem logging in. Check your email and password or create an account.',
            forLecturer: true,
        });
    }
    req.session.username = result.username;
    req.session.name = result.name;
    req.session.permission = 1;
    req.session.isAuth = true;

    res.redirect('/lecturer');
});

router.post('/sign-up', async function (req, res) {
    const result = await lecturerModel.singleByUsername(req.body.username);
    console.log(req.body);
    if (result) {
        return res.render('vwLecturer/sign-up', {
            err_message: 'This account already exists. Please login or enter another account.',
            forLecturer: true,
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
    res.redirect('/lecturer');
});

module.exports = router;