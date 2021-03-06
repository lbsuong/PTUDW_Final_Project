const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const userModel = require('../../models/user.model');
const cartModel = require('../../models/cart.model');
const courseModel = require('../../models/course.model');
const wishModel = require('../../models/wish.model');
const otpModel = require('../../models/otp.model');
const auth = require('../../middlewares/auth.mdw');
const lecturerModel = require('../../models/lecturer.model');
const config = require('../../config/default.json');
const ownedModel = require('../../models/owned.model');
const func = require('../../middlewares/function.mdw');
const transporter = require('../../utils/mail');
const { isBuffer } = require('util');
const { resolveSoa } = require('dns');

const router = express.Router();

const profile_img_path = 'data/profile_img/';

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

router.post('/log-in', async function (req, res) {
  let result;
  if (req.body.googlelogin === "true") {
    let userLogin = await userModel.singleByEmail(req.body.email);
    if (userLogin === null) {
      const newAccout = {
        username: req.body.email,
        password: bcrypt.hashSync(req.body.email, 10),
        name: req.body.name,
        email: req.body.email,
        verification: true,
        disable: false,
      }
      userModel.add(newAccout);

      req.session.isAuth = true;
      req.session.level = {
        user: true,
        lecturer: false,
        admin: false,
      }
      req.session.profile = {
        username: req.body.email,
        name: req.body.name,
        email: req.body.email,
        picture: req.body.picture,
        verification: true,
      }
      return res.redirect('/');
    } else {
      result = await userModel.singleByUsername(req.body.username);
    }
  } else {
    result = await userModel.singleByUsername(req.body.username);
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
  }

  if (result.disable == true) {
    return res.render('vwUser/log-in', {
      notify: {
        message: 'Your account has been block. Please contact support for more information',
        err: true,
      },
      forUser: true,
    });
  }

  req.session.isAuth = true;
  req.session.level = {
    user: true,
    admin: false,
    lecturer: false,
  }

  req.session.profile = {
    username: result.username,
    name: result.name,
    email: result.email,
    picture: result.picture,
    verification: result.verification,
  }

  if (result.verification == false) {
    return res.redirect('/user/vertify');
  }
  let url = '/';
  res.redirect('/');
});

router.post('/sign-up', async function (req, res) {
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
  let emailCheck = await userModel.singleByEmail(req.body.email);
  if (emailCheck) {
    return res.render('vwUser/sign-up', {
      notify: {
        message: "Email already exists. Please enter another email.",
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
    verification: false,
    disable: false,
  }
  userModel.add(newAccout);

  req.session.isAuth = true;
  req.session.level = {
    user: true,
    lecturer: false,
    admin: falsem
  }
  req.session.profile = {
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    picture: null,
    verification: false,
  }
  res.redirect('/user/vertify');
});

router.get('/vertify', async function (req, res) {
  if (req.session.isAuth === false) {
    return res.redirect('/user/log-in');
  }
  if (req.session.level.lecturer) {
    return res.redirect('/lecturer');
  }
  if (req.session.level.admin) {
    return res.redirect('/admin');
  }
  if (req.session.profile.verification) {
    return res.redirect('/');
  }

  let currentOTP = await otpModel.get(req.session.profile.username);
  if (currentOTP) {
    let currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let second = await otpModel.calSecond(currentOTP.date, currentTime);

    if (second < 600) {
      return res.render('vwUser/vertify', {
        forUser: true,
      });
    }
  }
  let otp = func.otp();

  // EMAIL VALIDACATION
  let mailOptions = {
    to: req.session.profile.email,
    subject: "OTP for registration",
    html: "<h3>OTP for account verification is </h3>" + otp,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }
    let dateNow = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // otp
    newOTP = {
      username: req.session.profile.username,
      code: otp,
      date: dateNow,
    }
    otpModel.add(newOTP);

    return res.render('vwUser/vertify', {
      forUser: true,
    });
  });
})

router.post('/vertify', async function (req, res) {
  //CHECK STATUS
  if (req.session.isAuth === false) {
    return res.redirect('/user/log-in');
  }
  if (req.session.level.lecturer) {
    return res.redirect('/lecturer');
  }
  if (req.session.level.admin) {
    return res.redirect('/admin');
  }
  if (req.session.profile.verification) {
    return res.redirect('/');
  }

  // HANDLE
  let code = req.body.code;
  let result = await otpModel.get(req.session.profile.username);

  let currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  let second = await otpModel.calSecond(result.date, currentTime);
  if (second > 600) {
    return res.render('vwUser/vertify', {
      forUser: true,
      notify: {
        message: "OTP code has expired. Please press RESEND to receive a new OTP.",
        err: true,
      }
    });
  }

  if (code == result.code) {
    newProfile = {
      username: req.session.profile.username,
      verification: true,
    }
    req.session.profile.verification = true;
    userModel.changeProfile(newProfile);
    otpModel.del(req.session.profile.username);
    return res.redirect('/');
  } else {
    return res.render('vwUser/vertify', {
      forUser: true,
      notify: {
        message: "Wrong OTP. Please enter the OTP you received.",
        err: true,
      },
    })
  }
});

router.post('/vertify/resend', async function (req, res) {
  if (req.body.resend == "resend") {
    otpModel.del(req.session.profile.username);
  }
  res.redirect('/user/vertify');
});

router.get('/profile', auth.user, async function (req, res) {
  res.render('vwUser/profile', {
    forUser: true,
  });
});

router.post('/profile', auth.user, async function (req, res) {
  let post_id = req.body.postId;

  // =========== CHANGE PICTURE ============
  if (post_id == null) {
    let rand = func.random(5);
    let pic_path = '/public/data/profile_img/';
    const storage = multer.diskStorage({
      destination: './public/data/profile_img/',
      filename: function (req, file, cb) {
        let file_ext = file.originalname.split('.').pop();
        let fname = req.session.profile.username.concat(rand).concat('.').concat(file_ext);
        pic_path = pic_path.concat(fname);
        cb(null, fname);
      }
    });
    const upload = multer({ storage });
    upload.single('filename')(req, res, function (err) {
      if (err) {
        return res.render('vwUser/profile', {
          notify: {
            message: "Something Went Wrong! Please Try Again",
            err: true,
          },
          forUser: true,
        })
      } else {
        userModel.changePicture(pic_path, req.session.profile.username);
        req.session.profile.picture = pic_path;
        return res.redirect('/user/profile');
      }
    });
  }
  // ========================================


  // =========== CHANGE PASSWORD ============ 
  if (post_id === "password") {
    let result = await userModel.singleByUsername(req.session.profile.username);

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
    userModel.changePassword(newPassword, req.session.profile.username);
    res.render('vwUser/profile', {
      forUser: true,
      notify: {
        message: "Change Password Successfully!",
        err: false,
      },
    });
  }
  // =========== CHANGE PROFILE =============
  if (post_id === "info") {
    let checkEmail = await userModel.singleByEmail(req.body.email);
    if (checkEmail) {
      if (checkEmail.username !== req.session.profile.username) {
        return res.render('vwUser/profile', {
          notify: {
            message: "Email already exists. Please enter another email.",
            err: true,
          },
          forUser: true,
        });
      }
    }
    let vertify = true;
    if (req.body.email != req.session.profile.email) {
      vertify = false;
      req.session.profile.verification = false;
    }

    newProfile = {
      username: req.session.profile.username,
      name: req.body.name,
      email: req.body.email,
      verification: vertify,
    }
    userModel.changeProfile(newProfile);

    req.session.profile.name = req.body.name;
    req.session.profile.email = req.body.email;
    return res.redirect('/user/profile');
  }
});

router.get('/lecturer/:username', async function (req, res) {
  const username = req.params.username;
  const lecturer = await lecturerModel.singleByUsername(username);

  let page = +req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * config.pagination.limit;

  const total = await courseModel.countCourseByLecID(username);
  const nPage = Math.ceil(total / config.pagination.limit);
  const pageItems = [];
  for (i = 1; i <= nPage; i++) {
    const item = {
      value: i,
      isActive: i === page
    }
    pageItems.push(item);
  }
  const courses = await courseModel.pageOnCourseByLecID(username, config.pagination.limit, offset);

  res.render('vwLecturer/about', {
    lecturer,
    courses,
    pageItems,
    canGoPrevious: page > 1,
    canGoNext: page < nPage,
    previousPage: +page - 1,
    nextPage: +page + 1
  });
});

router.get('/course', auth.user, async function (req, res) {
  const limit = 12;
  let c_page = +req.query.c || 1;
  if (c_page < 1) c_page = 1;

  const c_offset = (c_page - 1) * limit;
  const c_total = await ownedModel.countByUsername(req.session.profile.username);
  const c_npage = Math.ceil(c_total / limit);

  const c_pageItems = [];

  for (i = 1; i <= c_npage; i++) {
    const item = {
      value: i,
      isActive: i === c_page,
    }
    c_pageItems.push(item);
  }
  // Load course
  let course = await ownedModel.singleByUsername(req.session.profile.username, limit, c_offset);
  res.render('vwUser/course', {
    forUser: true,
    course,
    c_pageItems,
    c_canGoPrevious: c_page > 1,
    c_canGoNext: c_page < c_npage,
    c_previousPage: +c_page - 1,
    c_nextPage: +c_page + 1
  })
});


module.exports = router;