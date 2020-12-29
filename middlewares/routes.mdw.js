module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('home');
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
  // app.use('/teaching', require('../routes/'))
}