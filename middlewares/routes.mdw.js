const courseModel = require('../models/course.model');
const categoryModel = require('../models/category.model');

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

  app.get('/lecturer', function (req, res) {
    res.render('vwLecturer/home', {
      forLecturer: true,
    })
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