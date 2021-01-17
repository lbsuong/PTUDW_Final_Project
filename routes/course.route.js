const express = require('express');
const courseModel = require('../models/course.model');
const lessonModel = require('../models/lesson.model');
const auth = require('../middlewares/auth.mdw');
const rateModel = require('../models/rate.model');
const config = require('../config/default.json');
const progressModel = require('../models/progress.model');

const router = express.Router();

router.get('/:id', async function (req, res) {
  const id = req.params.id;
  if (req.session.isAuth) {
    const result = await courseModel.userHasOwnedCourse(req.session.profile.username, id)
    if (result) {
      const firstLessonID = await lessonModel.getFirstLessonID(id);
      let url = '';
      if (firstLessonID === null) {
        url = `/course/${id}/lesson`;
      } else {
        url = `/course/${id}/lesson/${firstLessonID}`;
      }
      return res.redirect(url);
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

  let page = +req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * config.paginationOnRatingDetail.limit;

  const total = currentCourse.numrate;
  const nPage = Math.ceil(total / config.paginationOnRatingDetail.limit);
  const pageItems = [];
  for (i = 1; i <= nPage; i++) {
    const item = {
      value: i,
      isActive: i === page
    }
    pageItems.push(item);
  }
  const rating = await rateModel.pageOnRatingByCourseID(id, offset);

  const lessonList = await lessonModel.allByCourse(id);

  res.render('vwCourse/course', {
    forUser: true,
    currentCourse,
    status,
    topFiveMostPopularBySameCat,
    rating,
    pageItems,
    canGoPrevious: page > 1,
    canGoNext: page < nPage,
    previousPage: +page - 1,
    nextPage: +page + 1,
    lessonList
  });
});

router.get('/:id/lesson', auth.user, async function (req, res) {
  const id = req.params.id;
  res.render('vwCourse/lesson', {
    layout: 'course-layout.hbs',
  });
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
  const lesson = await lessonModel.singleByID(lessonid);
  const allLesson = await lessonModel.allByCourse(id);
  for (i = 0; i < allLesson.length; i++) {
    allLesson[i].isActive = (allLesson[i].id === lessonid)
  }

  const isAlreadyRated = await rateModel.isAlreadyRated(req.session.profile.username, id);
  const progress = await progressModel.getProcess(req.session.profile.username, id);

  res.render('vwCourse/lesson', {
    layout: 'course-layout.hbs',
    allLesson,
    lesson,
    course,
    alreadyRated: isAlreadyRated,
    progress
  });
});

router.post('/:id/lesson/:lessonid', auth.user, async function (req, res) {
  const id = req.params.id;
  const lessonid = req.params.lessonid;
  await progressModel.add(req.session.profile.username, id, lessonid)
});

router.get('/:id/rate', auth.user, async function (req, res) {
  const id = +req.params.id;
  if (req.session.isAuth) {
    const result = await courseModel.userHasOwnedCourse(req.session.profile.username, id)
    if (!result) {
      return res.redirect(`/course/${id}`);
    }
  }
  const course = await courseModel.singleByID(id);
  const isAlreadyRated = await rateModel.isAlreadyRated(req.session.profile.username, id);
  if (isAlreadyRated) {
    return res.render('vwCourse/rate', {
      layout: 'course-layout.hbs',
      course,
      alreadyRated: true
    });
  }

  res.render('vwCourse/rate', {
    layout: 'course-layout.hbs',
    course,
    alreadyRated: false
  });
});

router.post('/:id/rate', async function (req, res) {
  const id = +req.params.id;
  await rateModel.add(req.body.comment, req.body.star, id, req.session.profile.username);
  await rateModel.addNumRate(id, 1);
  await rateModel.calRate(id);

  res.redirect(`/course/${id}`);
});

module.exports = router;