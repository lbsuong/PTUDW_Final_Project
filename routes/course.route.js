const express = require('express');
const courseModel = require('../models/course.model');
const lessonModel = require('../models/lesson.model');
const auth = require('../middlewares/auth.mdw');
const rateModel = require('../models/rate.model');

const router = express.Router();

router.get('/:id', async function (req, res) {
  const id = req.params.id;
  if (req.session.isAuth) {
    const result = await courseModel.userHasOwnedCourse(req.session.profile.username, id)
    if (result) {
      return res.redirect(`/course/${id}/lesson/1`);
    }
  }

  const currentCourse = await courseModel.singleByID(id);
  let status = '';
  if (currentCourse.status === 0) {
    status = 'incompleted'
  } else {
    status = 'completed'
  }
  const topFiveMostPopularBySameCat = await courseModel.topMostPopularByCategory(5, currentCourse.categoryid, id);
  await courseModel.addOneViewByID(id);

  res.render('vwCourse/course', {
    currentCourse,
    status,
    topFiveMostPopularBySameCat
  });
});

router.get('/:id/lesson', auth.user, async function (req, res) {
  const id = req.params.id;
  res.redirect(`/course/${id}/lesson/1`);
});

router.get('/:id/lesson/:lessonid', auth.user, async function (req, res) {
  const id = +req.params.id;
  if (req.session.isAuth) {
    const result = await courseModel.userHasOwnedCourse(req.session.profile.username, id)
    if (!result) {
      return res.redirect(`/course/${id}`);
    }
  }
  const lessonid = +req.params.lessonid;

  const course = await courseModel.singleByID(id);
  const lesson = await lessonModel.singleByID(lessonid, id);
  const allLesson = await lessonModel.allByCourse(id);
  for (i = 0; i < allLesson.length; i++) {
    allLesson[i].isActive = (allLesson[i].id === lessonid)
  }

  res.render('vwCourse/lesson', {
    layout: 'course-layout.hbs',
    allLesson,
    lesson,
    course
  });
});

router.get('/:id/rate', auth.user, async function (req, res) {
  const id = +req.params.id;
  let err_message = null;
  if (req.session.isAuth) {
    const result = await courseModel.userHasOwnedCourse(req.session.profile.username, id)
    if (!result) {
      return res.redirect(`/course/${id}`);
    }
  }
  const course = await courseModel.singleByID(id);
  if (rateModel.isAlreadyRated(req.session.profile.username)) {
    err_message = 'You\'re already rated.';
    return res.render('vwCourse/rate', {
      layout: 'course-layout.hbs',
      course,
      err_message
    });
  }

  res.render('vwCourse/rate', {
    layout: 'course-layout.hbs',
    course
  });
});

router.post('/:id/rate', async function (req, res) {
  const id = +req.params.id;
  console.log(req.body.comment);
  await rateModel.add(req.body.comment, req.body.star, id, req.session.profile.username);
  res.redirect(`/course/${id}`);
});

module.exports = router;