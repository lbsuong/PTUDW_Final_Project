const express = require('express');
const { searchOnCourse } = require('../models/search.model');
const searchModel = require('../models/search.model');

const router = express.Router();

router.get('/', async function (req, res) {
  const keywords = req.query.keywords;
  const searchResultOnCourse = await searchModel.searchOnCourse(keywords);
  const searchResultOnCategory = await searchModel.searchOnCategory(keywords);
  const result = [];

  // console.log(searchResultOnCategory);

  if (searchResultOnCourse !== null) {
    for (i = 0; i < searchResultOnCourse.length; i++) {
      result.push(searchResultOnCourse[i]);
    }
  }
  if (searchResultOnCategory !== null) {
    for (i = 0; i < searchResultOnCategory.length; i++) {
      duplicated = false;
      for (j = 0; j < result.length; j++) {
        if (result[j].id === searchResultOnCategory[i].id) {
          duplicated = true;
          break;
        }
      }
      if (!duplicated) {
        result.push(searchResultOnCategory[i]);
      }
    }
  }

  res.render('vwSearch/search', {
    result
  });
});

module.exports = router;