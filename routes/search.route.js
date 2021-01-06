const express = require('express');
const searchModel = require('../models/search.model');
const config = require('../config/default.json');

const router = express.Router();

router.get('/', async function (req, res) {
  const keywords = req.query.keywords;
  const tab = req.query.tab || 'course-tab';
  const sort = +req.query.sort || 1;

  let coursePage = +req.query.coursePage || 1;
  if (coursePage < 1) coursePage = 1;
  const courseOffset = (coursePage - 1) * config.pagination.limit;
  const courseTotal = await searchModel.countOnCourse(keywords);
  const courseNPage = Math.ceil(courseTotal / config.pagination.limit);
  const coursePageItems = [];
  for (i = 1; i <= courseNPage; i++) {
    const item = {
      value: i,
      isActive: i === coursePage
    }
    coursePageItems.push(item);
  }
  const searchResultOnCourse = await searchModel.pageOnCourse(keywords, courseOffset, sort);

  let categoryPage = +req.query.categoryPage || 1;
  if (categoryPage < 1) categoryPage = 1;
  const categoryOffset = (categoryPage - 1) * config.pagination.limit;
  const categoryTotal = await searchModel.countOnCategory(keywords);
  const categoryNPage = Math.ceil(categoryTotal / config.pagination.limit);
  const categoryPageItems = [];
  for (i = 1; i <= categoryNPage; i++) {
    const item = {
      value: i,
      isActive: i === categoryPage
    }
    categoryPageItems.push(item);
  }
  const searchResultOnCategory = await searchModel.pageOnCategory(keywords, categoryOffset, sort);

  res.render('vwSearch/search', {
    keywords,
    tab,
    sort,
    searchResultOnCourse,
    searchResultOnCategory,
    courseCurrentPage: coursePage,
    coursePageItems,
    courseCanGoPrevious: coursePage > 1,
    courseCanGoNext: coursePage < courseNPage,
    coursePreviousPage: +coursePage - 1,
    courseNextPage: +coursePage + 1,
    categoryCurrentPage: categoryPage,
    categoryPageItems,
    categoryCanGoPrevious: categoryPage > 1,
    categoryCanGoNext: categoryPage < categoryNPage,
    categoryPreviousPage: +categoryPage - 1,
    categoryNextPage: +categoryPage + 1
  });
});

module.exports = router;