const { response } = require("express");

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
      if (req.session.level.user) {
        if (req.session.profile.verification == false) {
          return res.redirect('/user/vertify');
        }
        if (req.session.profile.disable) {
          return res.render('blockAccount');
        }
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
      if (req.session.level.lecturer) {
        if (req.session.profile.disable) {
          return res.render('blockAccount');
        }
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
        return res.render('refuse', {
          forUser: true,
        });
      }
      if (req.session.level.lecturer == true) {
        return res.render('refuse', {
          forLecturer: true,
        });
      }
    }
    next();
  },
}