const courseModel = require('../models/course.model');
const categoryModel = require('../models/category.model');

module.exports = function (app) {
  app.get('/', async function (req, res) {
<<<<<<< HEAD
    const topThreeMostPopularCoursesInWeek = await courseModel.topMostPopularInAWeek(3);
    const topTenMostViewCourses = await courseModel.topMostView(10);
    const topTenNewestCourses = await courseModel.topNewest(10);
=======
    const topThreeMostPopularCoursesInWeek = await courseModel.topThreeMostPopularInWeek();
    const topTenMostViewCourses = await courseModel.topTenMostView();
    const topTenNewestCourses = await courseModel.topTenNewest();
>>>>>>> 37d1c92089f3b9c6f88c99b47990bde549584991

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
    res.render('vwAdmin/home', {
      forAdmin: true,
    })
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


  app.use('/user/cart', require('../routes/cart.route'));
  app.use('/user', require('../routes/front/user.route'));

  app.use('/lecturer', require('../routes/front/lecturer.route'));
  app.use('/admin', require('../routes/front/admin.route'));

  app.use('/category', require('../routes/category.route'));
  app.use('/course', require('../routes/course.route'));

  app.use('/search', require('../routes/search.route'));
}