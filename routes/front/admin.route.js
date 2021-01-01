const express = require('express');
const bcrypt = require('bcryptjs');
const adminModel = require('../../models/admin.model');

const router = express.Router();

router.get('/log-in', function(req, res){
    res.render('vwAdmin/log-in',{
        forAdmin: true,
    });
});

router.post('/log-in', async function(req, res){
    let result = await adminModel.singleByUsername(req.body.username);
    if(result === null){
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

    res.redirect('/admin');
});

module.exports = router;