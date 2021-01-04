const courseModel = require('../models/course.model');
const categoryModel = require('../models/category.model');

module.exports = function(app) {
  app.get('/', async function(req, res) {
    const topThreeMostPopularCoursesInWeek = await courseModel.topThreeMostPopularInWeek();
    const topTenMostViewCourses = await courseModel.topTenMostView();
    const topTenNewestCourses = await courseModel.topTenNewest();

    const topTenMostCountCategories = await categoryModel.topTenMostCount();

    res.render('home', {
      forUser: true,
      topThreeMostPopularCoursesInWeek: topThreeMostPopularCoursesInWeek,
      topTenMostViewCourses: topTenMostViewCourses,
      topTenNewestCourses: topTenNewestCourses,
      topTenMostCountCategories: topTenMostCountCategories
    });
  });

  app.get('/lecturer', function(req,res){
    res.render('vwLecturer/home', {
      forLecturer: true,
    })
  });

  app.get('/admin', function(req, res){
    res.render('vwAdmin/home', {
      forAdmin: true,
    })
  });

  app.get('/redirect', function(req, res){
    if (req.headers.referer) {
      req.session.retUrl = req.headers.referer;
    }
    let url = req.session.retUrl || '/';
    res.redirect(url);
  });

  app.get('/privacy', function(req, res){
    res.render('privacy');
  })

  app.use('/user', require('../routes/front/user.route'));
  app.use('/lecturer', require('../routes/front/lecturer.route'));
  app.use('/admin', require('../routes/front/admin.route'));
  
  app.use('/category', require('../routes/category.route'));
  app.use('/course', require('../routes/course.route'));
}