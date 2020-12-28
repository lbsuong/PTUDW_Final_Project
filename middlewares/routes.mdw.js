module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('home');
  });

  app.get('/redirect', function(req, res){
    if (req.headers.referer) {
      req.session.retUrl = req.headers.referer;
    }
    let url = res.locals.retUrl || '/';
    res.redirect(url);
  });

  app.use('/account', require('../routes/front/account.route'));
}