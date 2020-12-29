const express = require('express');
const bcrypt = require('bcryptjs');

const userModel = require('../../models/user.model');
const lecturerModel = require('../../models/lecturer.model');
const moderatorModel = require('../../models/admin.model');
// const { singleByUsername } = require('../../models/user.model');

const router = express.Router();

router.get('/log-in', function(req, res) {
  res.render('vwAccountUser/log-in');
});

router.get('/sign-up', function(req, res) {
  res.render('vwAccountUser/sign-up');
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
  res.render('vwAccountUser/cart');
  } else {
    res.redirect('/account/log-in')
  }
});


// async function findUserByUsername(username) {
//   let user = await userModel.singleByUsername(username);
//   if (user != null) {
//     return {
//       user: user,
//       permission: 1,
//       err_message: null
//     }
//   }

//   user = await lecturerModel.singleByUsername(username);
//   if (user != null) {
//     return {
//       user: user,
//       permission: 2,
//       err_message: null
//     }
//   }

//   user = await moderatorModel.singleByUsername(username);
//   if (user != null) {
//     return {
//       user: user,
//       permission: 3,
//       err_message: null
//     }
//   }

//   return {
//     user: null,
//     permission: 0,
//     err_message: 'Invalid username or password.'
//   }
// }

router.post('/log-in', async function(req, res) {
  let result = await userModel.singleByUsername(req.body.username);
  if(result == null){
    // console.log("Logging failed");
    return res.render('vwAccountUser/log-in', {
      err_message: 'There was a problem logging in. Check your email and password or create an account.',
    });
  }
  const correctPassword = bcrypt.compareSync(req.body.password, result.password);
  console.log(correctPassword);
  if (correctPassword == false) {
    // console.log("Logging failed");
    return res.render('vwAccountUser/log-in', {
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
    return res.render('vwAccountUser/sign-up', {
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