const express = require('express');
const bcrypt = require('bcryptjs');

const userModel = require('../../models/user.model');
const lecturerModel = require('../../models/lecturer.model');
const moderatorModel = require('../../models/moderator.model');

const router = express.Router();

router.get('/log-in', function(req, res) {
  res.render('vwAccountUser/log-in');
});

router.get('/sign-up', function(req, res) {
  res.render('vwAccountUser/sign-up');
});

router.post('/log-in', async function(req, res) {
  let user = await userModel.singleByUsername(req.body.uname);
  if (user == null) {
    user = await lecturerModel.singleByUsername(req.body.uname);
    if (user == null) {
      user = await moderatorModel.singleByUsername(req.body.uname);
      if (user == null) {
        console.log("Logging failed");
        return res.render('vwAccountUser/log-in', {
          err_message: 'Invalid username or password.'
        });
      }
    }
  }
  
  const correctPassword = bcrypt.compare(req.body.psw, user.password);
  if (correctPassword == false) {
    console.log("Logging failed");
    return res.render('vwAccountUser/log-in', {
      err_message: 'Invalid username or password.'
    });
  }

  res.redirect('/');
  console.log('Log in successfully.');
});

module.exports = router;