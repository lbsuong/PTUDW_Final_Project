module.exports = function (app) {
  app.use(async function (req, res, next) {
    if (typeof (req.session.isAuth) === 'undefined') {
      req.session.isAuth = false;
    }

    res.locals.isAuth = req.session.isAuth;
    res.locals.username = req.session.username;
    res.locals.name = req.session.name;
    res.locals.retUrl = req.headers.referer;
   
    next();
  })
}