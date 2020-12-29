const express = require('express');
const bcrypt = require('bcryptjs');

const userModel = require('../../models/user.model');

const router = express.Router();

router.get('/log-in', function(req, res) {
  res.render('vwUser/log-in');
});

router.get('/sign-up', function(req, res) {
  res.render('vwUser/sign-up');
});

router.get('/sign-out', function(req,res){
  req.session.authUser = null;
  req.session.permission = -1;
  req.session.isAuth = false;
  
  let url = '/';
  res.redirect(url);
});

router.get('/cart', function(req,res){
  if(req.session.isAuth){
  res.render('vwUser/cart');
  } else {
    res.redirect('/account/log-in')
  }
});

router.post('/log-in', async function(req, res) {
  let result = await userModel.singleByUsername(req.body.username);
  if(result == null){
    // console.log("Logging failed");
    return res.render('vwUser/log-in', {
      err_message: 'There was a problem logging in. Check your email and password or create an account.',
    });
  }
  const correctPassword = bcrypt.compareSync(req.body.password, result.password);
  if (correctPassword == false) {
    // console.log("Logging failed");
    return res.render('vwUser/log-in', {
      err_message: 'There was a problem logging in. Check your email and password or create an account.',
    });
  }

  req.session.username = result.username;
  req.session.name = result.name;
  req.session.permission = 0;
  req.session.isAuth = true;

  let url =  '/';
  res.redirect('/');
});

router.post('/sign-up', async function(req, res){
  console.log(req.body);
  let result = await userModel.singleByUsername(req.body.username);
  if(result){
    return res.render('vwUser/sign-up', {
      err_message: "Duplicate username",
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

})

module.exports = router;