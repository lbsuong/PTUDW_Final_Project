const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const userModel = require('../../models/user.model');
const auth = require('../../middlewares/auth.mdw');
const { notify } = require('./lecturer.route');

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
  req.session.isAuth = false;
  req.session.profile = null;
  req.session.userLevel = null;

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
    return res.render('vwUser/log-in', {
      notify: {
        message: 'There was a problem logging in. Check your email and password or create an account.',
        err: true,
      },
      forUser: true,
    });
  }
  const correctPassword = bcrypt.compareSync(req.body.password, result.password);
  if (correctPassword == false) {
    return res.render('vwUser/log-in', {
      notify: {
        message: 'There was a problem logging in. Check your email and password or create an account.',
        err: true,
      },
      forUser: true,
    });
  }

  req.session.isAuth = true;
  req.session.userLevel = {
    user: true,
    admin: false,
    lecturer: false,
  }

  req.session.profile = {
    username: result.username,
    name: result.name,
    email: result.email,
    picture: result.picture
  }

  let url = '/';
  res.redirect('/');
});

router.post('/sign-up', async function (req, res) {
  console.log(req.body);
  let result = await userModel.singleByUsername(req.body.username);
  if (result) {
    return res.render('vwUser/sign-up', {
      notify: {
        message: "Username already exists. Please enter another account.",
        err: true,
      },
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
  res.render('vwUser/profile', {
    forUser: true,
  });
});

router.post('/profile', auth, async function (req, res) {
  console.log(req.body);
  let post_id = req.body.postId;

  // =========== CHANGE PICTURE ============
  if (post_id == "picture") {
    console.log("CHANGING PICTURE!");
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './public/img/')
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname)
      }
    });
    const upload = multer({ storage });
    // upload.single('fuMain')(req, res, function (err) {
    upload.single('filename')(req, res, function (err) {
      console.log(req.body);
      if (err) {

      } else {
        res.render('vwUser/profile', {
          notify: {
            message: "Change Your Picture Successfully!",
            err: false,
          },
          forUser: true,
        })
      }
    });
  }
  // ========================================


  // =========== CHANGE PASSWORD ============ 
  if (post_id === "password") {
    let result = await userModel.singleByUsername(req.session.username);
    const correctPassword = bcrypt.compareSync(req.body.currPass, result.password);
    if (correctPassword == false) {
      return res.render('vwUser/profile', {
        notify: {
          message: "Wrong Password! Please try again!",
          err: true,
        },
        forUser: true,
      });
    }
    const newPassword = bcrypt.hashSync(req.body.newPass, 10);
    userModel.changePassword(newPassword, req.session.username);
    res.render('vwUser/profile', {
      forUser: true,
      notify: {
        message: "Change Password Successfully!",
        err: false,
      },
    });
  }
  // ==========================================
})

module.exports = router;