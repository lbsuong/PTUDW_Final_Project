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

async function findUserByUsername(username) {
  let user = await userModel.singleByUsername(username);
  if (user != null) {
    return {
      user: user,
      permission: 1,
      err_message: null
    }
  }

  user = await lecturerModel.singleByUsername(username);
  if (user != null) {
    return {
      user: user,
      permission: 2,
      err_message: null
    }
  }

  user = await moderatorModel.singleByUsername(username);
  if (user != null) {
    return {
      user: user,
      permission: 3,
      err_message: null
    }
  }

  return {
    user: null,
    permission: 0,
    err_message: 'Invalid username or password.'
  }
}

router.post('/log-in', async function(req, res) {
  let result = await findUserByUsername(req.body.uname);
  
  const correctPassword = bcrypt.compare(req.body.psw, result.user.password);
  if (correctPassword == false) {
    console.log("Logging failed");
    return res.render('vwAccountUser/log-in', {
      err_message: 'Invalid username or password.'
    });
  }

  req.session.authUser = result.user;
  req.session.permission = result.permission;
  req.session.isAuth = true;

  let url = '/';
  res.redirect(url);
});

module.exports = router;