const express = require('express');
const categoryModel = require('../models/category.model');
const courseModel = require('../models/course.model');
const config = require('../config/default.json');

const router = express.Router();

router.get('/:id', async function (req, res) {
  const id = req.params.id;

  let page = +req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * config.pagination.limit;

  const total = await courseModel.countByCategoryID(id);
  const nPage = Math.ceil(total / config.pagination.limit);
  const pageItems = [];
  for (i = 1; i <= nPage; i++) {
    const item = {
      value: i,
      isActive: i === page
    }
    pageItems.push(item);
  }

  const category = await categoryModel.singleByID(id);
  const courses = await courseModel.pageByCategoryID(id, offset);

  res.render('vwCategory/category', {
    categoryName: category.name,
    courses: courses,
    pageItems,
    canGoPrevious: page > 1,
    canGoNext: page < nPage,
    previousPage: +page - 1,
    nextPage: +page + 1
  });
});

module.exports = router;