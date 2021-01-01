const express = require('express');
const bcrypt = require('bcryptjs');

const userModel = require('../../models/user.model');
const auth = require('../../middlewares/auth.mdw');

const router = express.Router();

router.get('/log-in', function (req, res) {
  res.render('vwUser/log-in', {
    forUser: true,
  });
});

router.get('/sign-up', function (req, res) {
  res.render('vwUser/sign-up', {
    forUser: true,
  });
});

router.get('/sign-out', function (req, res) {
  req.session.authUser = null;
  req.session.permission = -1;
  req.session.isAuth = false;
  req.session.picture = null;

  let url = '/';
  res.redirect(url);
});

router.get('/cart', function (req, res) {
  if (req.session.isAuth) {
    res.render('vwUser/cart', {
      forUser: true,
    });
  } else {
    res.redirect('/user/log-in')
  }
});

router.post('/log-in', async function (req, res) {
  let result = await userModel.singleByUsername(req.body.username);
  if (result == null) {
    // console.log("Logging failed");
    return res.render('vwUser/log-in', {
      err_message: 'There was a problem logging in. Check your email and password or create an account.',
      forUser: true,
    });
  }
  const correctPassword = bcrypt.compareSync(req.body.password, result.password);
  if (correctPassword == false) {
    // console.log("Logging failed");
    return res.render('vwUser/log-in', {
      err_message: 'There was a problem logging in. Check your email and password or create an account.',
      forUser: true,
    });
  }

  req.session.username = result.username;
  req.session.name = result.name;
  req.session.permission = 0;
  req.session.isAuth = true;
  req.session.picture = result.picture;

  let url = '/';
  res.redirect('/');
});

router.post('/sign-up', async function (req, res) {
  console.log(req.body);
  let result = await userModel.singleByUsername(req.body.username);
  if (result) {
    return res.render('vwUser/sign-up', {
      err_message: "Duplicate username",
      forUser: true,
    });
  }

  const newAccout = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    name: req.body.name,
    email: req.body.email,
  }

  userModel.add(newAccout);
  res.redirect('/');

});

router.get('/profile', auth, async function (req, res) {
  let result = await userModel.singleByUsername(req.session.username);
  res.render('vwUser/profile', {
    forUser: true,
    profile: result,
  });
  console.log(result);
});

router.post('/profile', auth, async function (req, res) {
  console.log(req.body);
  let result = await userModel.singleByUsername(req.session.username);
  const correctPassword = bcrypt.compareSync(req.body.currPass, result.password);
  if (correctPassword == false) {
    // console.log("Logging failed");
    return res.render('vwUser/profile', {
      err_message: 'Wrong Password! Please try again!',
      forUser: true,
    });
  }
  const newPassword = bcrypt.hashSync(req.body.newPass, 10);
  userModel.changePassword(newPassword, req.session.username);
  res.redirect('vwUser/profile', {
    suc_message: 'Password Changed Successfully!',
  })
})

module.exports = router;