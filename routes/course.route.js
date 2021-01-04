const express = require('express');
const courseModel = require('../models/course.model');

const router = express.Router();

router.get('/:id', async function(req, res) {
  const id = req.params.id;
  const result = await courseModel.singleByID(id);
  await courseModel.addOneViewByID(id);

  res.render('vwCourse/course', {
    ...result
  });
});

module.exports = router;