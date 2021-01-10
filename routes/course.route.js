const express = require('express');
const courseModel = require('../models/course.model');
const sectionModel = require('../models/section.model');
const lectureModel = require('../models/lecture.model');

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

router.get('/:id/lecture', async function (req, res) {
  const id = req.params.id;
  res.redirect(`/course/${id}/lecture/1`);
});

router.get('/:id/lecture/:lectureid', async function (req, res) {
  const id = +req.params.id;
  const lectureid = +req.params.lectureid;

  const course = await courseModel.singleByID(id);
  const allSection = await sectionModel.allSectionByCourseID(course.id);
  const lecture = await lectureModel.singleByID(id, lectureid);
  if (lecture !== null) {
    lecture.isVideo = (lecture.contenttype === 'video');
    lecture.isDocument = (lecture.contenttype === 'document')
  }

  for (section of allSection) {
    const lectureList = await lectureModel.allLectureBySectionID(section.sectionid);
    sectionIsActive = false;
    for (i = 0; i < lectureList.length; i++) {
      lectureList[i].isActive = (lectureList[i].id === lectureid)
      if (lectureList[i].isActive) {
        sectionIsActive = true;
      }
    }
    section.allLecture = lectureList
    section.isActive = sectionIsActive;
  }

  res.render('vwCourse/lecture', {
    layout: 'course-layout.hbs',
    course,
    lecture,
    allSection
  });
});

module.exports = router;