const { value } = require('numeral');
const categoryModel = require('../models/category.model');

module.exports = function (app) {
  app.use(async function (req, res, next) {
    if (typeof (req.session.isAuth) === 'undefined') {
      req.session.isAuth = false;
    }

    res.locals.isAuth = req.session.isAuth;
    res.locals.username = req.session.username;
    res.locals.name = req.session.name;
    res.locals.retUrl = req.headers.referer;
    res.locals.picture = req.session.picture;

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