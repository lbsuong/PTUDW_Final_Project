const express = require('express');
const categoryModel = require('../models/category.model');
const courseModel = require('../models/course.model');

const router = express.Router();

router.get('/:id', async function(req, res) {
  const id = req.params.id;
  const category = await categoryModel.singleByID(id);
  const courses = await courseModel.allByCategoryID(id);

  res.render('vwCategory/category', {
    categoryName: category.name,
    courses: courses
  });
});

module.exports = router;