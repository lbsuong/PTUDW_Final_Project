module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('home');
  });

  app.get('/signin', function(req, res){
    res.render('signin', {
      layout: false
    });
  })

  app.get('/signup', function(req, res){
    res.render('signup',{
      layout: false
    })
  })
}