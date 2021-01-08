
module.exports = {
  user: function (req, res, next) {
    if (req.session.isAuth === false) {
      req.session.retUrl = req.originalUrl;
      return res.redirect('/user/log-in');
    } else {
      if (req.session.level.admin == true) {
        return res.redirect('/admin');
      }
      if (req.session.level.lecturer == true) {
        return res.redirect('/lecturer');
      }
    }
    next();
  },

  lecturer: function (req, res, next) {
    if (req.session.isAuth === false) {
      req.session.retUrl = req.originalUrl;
      return res.redirect('/lecturer/log-in');
    } else {
      if (req.session.level.admin == true) {
        return res.redirect('/admin');
      }
      if (req.session.level.user == true) {
        return res.redirect('/');
      }
    }
    next();
  },

  admin: function (req, res, next) {
    if (req.session.isAuth === false) {
      req.session.retUrl = req.originalUrl;
      return res.redirect('/admin/log-in');
    }
    else {
      if (req.session.level.user == true) {
        return res.redirect('/');
      }
      if (req.session.level.lecturer == true) {
        return res.redirect('/lecturer');
      }
    }
    next();
  },
}