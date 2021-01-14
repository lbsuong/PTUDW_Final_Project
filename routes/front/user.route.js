const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const userModel = require('../../models/user.model');
const cartModel = require('../../models/cart.model');
const courseModel = require('../../models/course.model');
const wishModel = require('../../models/wish.model');
const auth = require('../../middlewares/auth.mdw');
const lecturerModel = require('../../models/lecturer.model');
const config = require('../../config/default.json');
const ownedModel = require('../../models/owned.model');

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
  let result = await userModel.singleByUsername(req.body.username);
  if (result == null) {
    console.log('render');
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

  // LOAD CART

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

router.get('/profile', auth.user, async function (req, res) {
  res.render('vwUser/profile', {
    forUser: true,
  });
});

router.post('/profile', auth.user, async function (req, res) {
  console.log(req.body);
  let post_id = req.body.postId;

  // =========== CHANGE PICTURE ============
  if (post_id == null) {
    console.log("CHANGING PICTURE!");
    let filename = req.session.profile.username;
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './public/data/profile_img/')
      },
      filename: function (req, file, cb) {
        filename = filename.concat(file.originalname);
        cb(null, filename);
      }
    });
    const upload = multer({ storage });
    upload.single('filename')(req, res, function (err) {
      console.log(req.body);
      if (err) {
        return res.render('vwUser/profile', {
          notify: {
            message: "Something Went Wrong! Please Try Again",
            err: true,
          },
          forUser: true,
        })
      } else {
        filename = profile_img_path.concat(filename);
        console.log("Filename: ");
        console.log(filename);
        userModel.changePicture(filename, req.session.profile.username);
        req.session.profile.picture = filename;
        return res.render('vwUser/profile', {
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
    console.log("IAMHERE");
    let result = await userModel.singleByUsername(req.session.profile.username);
    console.log(result);
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
  // ==========================================
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
  console.log(course);
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