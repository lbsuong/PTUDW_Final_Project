const courseModel = require('../models/course.model');
const categoryModel = require('../models/category.model');
const rateModel = require('../models/rate.model');
const config = require('../config/default.json');

const DEFAULT_ADMIN_PAGE = 'user-list';

module.exports = function (app) {
  app.get('/', async function (req, res) {
    const topThreeMostPopularCoursesInWeek = await courseModel.topMostPopularInAWeek(3);
    const topTenMostViewCourses = await courseModel.topMostView(10);
    const topTenNewestCourses = await courseModel.topNewest(10);

    const topTenMostCountCategories = await categoryModel.topMostCount(10);

    res.render('home', {
      forUser: true,
      topThreeMostPopularCoursesInWeek,
      topTenMostViewCourses,
      topTenNewestCourses,
      topTenMostCountCategories
    });
  });

  app.get('/lecturer', async function (req, res) {
    if (req.session.isAuth && req.session.level.lecturer) {
      const limit = config.paginationOnLecHome.limit;
      let c_page = +req.query.c || 1;
      if (c_page < 1) c_page = 1;

      let pr = +req.query.r || 1;
      if (pr < 1) pr = 1;

      const c_offset = (c_page - 1) * limit;
      const c_total = await courseModel.countCourseByLecID(req.session.profile.username);
      const c_npage = Math.ceil(c_total / limit);
      const c_pageItems = [];

      for (i = 1; i <= c_npage; i++) {
        const item = {
          value: i,
          isActive: i === c_page,
        }
        c_pageItems.push(item);
      }
      const course = await courseModel.pageOnCourseByLecID(req.session.profile.username, limit, c_offset);

      // Load review
      // let result;
      // if (req.session.isAuth === true && req.session.level.lecturer) {
      //   result = await rateModel.recentlyById(req.session.profile.username);
      // } else {
      //   result = null;
      // }

      // Load course
      res.render('vwLecturer/home', {
        forLecturer: true,
        course,
        c_pageItems,
        c_canGoPrevious: c_page > 1,
        c_canGoNext: c_page < c_npage,
        c_previousPage: +c_page - 1,
        c_nextPage: +c_page + 1
      })
    }
    else {
      res.render('vwLecturer/home', {
        forLecturer: true,
      })
    }
  });

  app.get('/admin', function (req, res) {
    if (req.session.permission === 2 && req.session.isAuth) {
      res.redirect(`/admin/${DEFAULT_ADMIN_PAGE}`);
    } else {
      res.redirect(`/admin/log-in`);
    }
  });

  app.get('/redirect', function (req, res) {
    if (req.headers.referer) {
      req.session.retUrl = req.headers.referer;
    }
    let url = req.session.retUrl || '/';
    res.redirect(url);
  });

  app.get('/privacy', function (req, res) {
    res.render('privacy');
  })

  app.get('/general/sign-out', function (req, res) {
    req.session.isAuth = false;
    req.session.profile = null;
    req.session.userLevel = null;

    let url = '/';
    res.redirect(url);
  });

  app.use('/user/cart', require('../routes/cart.route'));
  app.use('/user', require('../routes/front/user.route'));

  app.use('/lecturer', require('../routes/front/lecturer.route'));
  app.use('/admin', require('../routes/front/admin.route'));

  app.use('/category', require('../routes/category.route'));
  app.use('/course', require('../routes/course.route'));

  app.use('/search', require('../routes/search.route'));
}