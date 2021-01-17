const categoryModel = require('../models/category.model');
const cartModel = require('../models/cart.model');
module.exports = function (app) {
  app.use(async function (req, res, next) {
    if (typeof (req.session.isAuth) === 'undefined') {
      req.session.isAuth = false;
      req.session.level = {
        admin: false,
        lecturer: false,
        user: false,
      };
      req.session.profile = null;
    }

    res.locals.isAuth = req.session.isAuth;
    res.locals.level = req.session.level;
    res.locals.profile = req.session.profile;
    if (req.session.preurl) {
      if (req.session.preurl !== req.headers.referer)
        req.session.preurl = req.headers.referer;
    } else {
      req.session.preurl = req.headers.referer;
    }
    if (req.session.isAuth && req.session.level.user) {
      let cartID = await cartModel.cartByUsername(req.session.profile.username);
      if (cartID.length === 0) {
        req.session.profile.cart = null;
      }
      else {
        req.session.profile.cart = cartID.length;
      }
    }
    next();
  })

  app.use(async function (req, res, next) {
    const result = [];
    allLevelOneCatID = await categoryModel.allCatIDByLevel(1);

    allLevelOneCatID.forEach(async function (value, index, array) {
      const subCatList = [];
      const rows = await categoryModel.subCatByID(value.id);

      rows.forEach(function (value, index, array) {
        subCatList.push({
          id: value.id,
          name: value.name,
          level: value.level
        });
      });

      result.push({
        id: value.id,
        name: value.name,
        level: value.level,
        subCat: subCatList
      });
    }),
      res.locals.category = result;

    next();
  })
}