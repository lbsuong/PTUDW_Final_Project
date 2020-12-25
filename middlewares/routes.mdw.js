module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('home');
  });

  app.get('/sign-in', function(req, res){
    res.render('vwAccountUser/sign-in', {
      layout: false
    });
  })

  app.get('/sign-up', function(req, res){
    res.render('vwAccountUser/sign-up',{
      layout: false
    })
  })
}