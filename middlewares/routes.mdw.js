module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('home');
  });

  app.get('/log-in', function(req, res){
    res.render('vwAccountUser/log-in');
  })

  app.get('/sign-up', function(req, res){
    res.render('vwAccountUser/sign-up')
  })
}