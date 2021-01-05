const express = require('express');
const courseModel = require('../models/course.model');

const router = express.Router();

router.get('/:id', async function (req, res) {
  const id = req.params.id;
  const currentCourse = await courseModel.singleByID(id);
  const topFiveMostPopularBySameCat = await courseModel.topMostPopularByCategory(5, currentCourse.categoryid, id);
  await courseModel.addOneViewByID(id);

  res.render('vwCourse/course', {
    currentCourse,
    topFiveMostPopularBySameCat
  });
});

module.exports = router;