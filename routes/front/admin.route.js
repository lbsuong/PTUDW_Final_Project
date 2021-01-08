const express = require('express');
const bcrypt = require('bcryptjs');
const adminModel = require('../../models/admin.model');
const lecturerModel = require('../../models/lecturer.model');
const config = require('../../config/default.json');

const DEFAULT_ADMIN_PAGE = 'lecturer-list';

const router = express.Router();

router.get('/log-in', function (req, res) {
    res.render('vwAdmin/log-in', {
        forAdmin: true,
    });
});

router.post('/log-in', async function (req, res) {
    let result = await adminModel.singleByUsername(req.body.username);
    if (result === null) {
        return res.render('vwAdmin/log-in', {
            err_message: 'There was a problem logging in. Check your email and password or create an account.',
            forLecturer: true,
        })
    }

    const correctPassword = bcrypt.compareSync(req.body.password, result.password);
    console.log(correctPassword);
    if (correctPassword == false) {
        return res.render('vwAdmin/log-in', {
            err_message: 'There was a problem logging in. Check your email and password or create an account.',
            forAdmin: true,
        });
    }
    req.session.username = result.username;
    req.session.name = result.name;
    req.session.permission = 2;
    req.session.isAuth = true;

    res.redirect(`/admin/${DEFAULT_ADMIN_PAGE}`);
});

router.get('/lecturer-list', async function (req, res) {
    let message;
    if (req.query.result === '1') {
        message = 'Account has been created successfully';
    } else if (req.query.result === '2') {
        message = 'Account has been changed';
    } else if (req.query.result === '3') {
        message = 'Account has been deleted'
    } else {
        message = null;
    }
    let page = +req.query.page || 1;
    if (page < 1) page = 1;
    const offset = (page - 1) * config.paginationOnLecturer.limit;
    const total = await lecturerModel.countOnLecturer();
    const nPage = Math.ceil(total / config.paginationOnLecturer.limit);
    const pageItems = [];
    for (i = 1; i <= nPage; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        pageItems.push(item);
    }
    const lecturerList = await lecturerModel.pageOnLecturer(offset);

    res.render('vwAdmin/lecturer-list', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        lecturerList,
        tabID: 'lecturers-list-link',
        message,
        pageItems,
        canGoPrevious: page > 1,
        canGoNext: page < nPage,
        previousPage: +page - 1,
        nextPage: +page + 1,
    });
});

router.get('/lecturer-list/edit/:username', async function (req, res) {
    const username = req.params.username;
    const lecturer = await lecturerModel.singleByUsername(username);
    res.render('vwAdmin/edit-lecturer-account', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        tabID: 'lecturers-list-link',
        lecturer
    });
});

router.post('/lecturer-list/edit/:username', async function (req, res) {
    if (req.body.password !== req.body.confirmPassword) {
        return res.render('vwAdmin/edit-lecturer-account', {
            layout: 'admin-layout.hbs',
            forAdmin: true,
            tabID: 'lecturers-list-link',
            err_message: 'Password does not match'
        });
    }

    const username = req.params.username;
    const newInfo = {
        password: req.body.password,
        name: req.body.name,
        email: req.body.email,
        bankid: req.body.bankid,
        bankname: req.body.bankname
    }
    await lecturerModel.changeProfile(username, newInfo);
    res.redirect('/admin/lecturer-list' + '?result=2');
});

router.get('/lecturer-list/create-lecturer-account', function (req, res) {
    res.render('vwAdmin/create-lecturer-account', {
        layout: 'admin-layout.hbs',
        forAdmin: true,
        tabID: 'lecturers-list-link',
    });
});

router.post('/lecturer-list/create-lecturer-account', async function (req, res) {
    const isExisted = await lecturerModel.singleByUsername(req.body.username);
    if (isExisted) {
        return res.render('vwAdmin/create-lecturer-account', {
            layout: 'admin-layout.hbs',
            forAdmin: true,
            err_message: 'Account has already existed. Please use another username.',
            tabID: 'lecturers-list-link'
        });
    }
    if (req.body.confirmPassword !== req.body.password) {
        return res.render('vwAdmin/create-lecturer-account', {
            layout: 'admin-layout.hbs',
            forAdmin: true,
            err_message: 'Password does not match',
            tabID: 'lecturers-list-link'
        });
    }
    await lecturerModel.add({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        name: req.body.username,
        email: req.body.email,
        bankid: req.body.bankid,
        bankname: req.body.bankname
    });
    res.redirect('/admin/lecturer-list' + '?result=1');
});

router.post('/lecturer-list/delete', async function (req, res) {
    await lecturerModel.deleteAccount(req.body.usernameWantToDelete);
    res.redirect('/admin/lecturer-list' + '?result=3')
});

module.exports = router;