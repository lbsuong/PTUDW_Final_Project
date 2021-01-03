const db = require('../utils/db');

const TBL_COURSE = 'course';
const TBL_LECTURER = 'lecturer';
const TBL_CATEGORY = 'category';

module.exports = {
  topThreeMostPopularInWeek() {
    return db.load(
      `SELECT ${TBL_COURSE}.*, ${TBL_LECTURER}.name AS lecturername, ${TBL_CATEGORY}.name AS categoryname, ${TBL_CATEGORY}.id AS categoryid
      FROM ${TBL_COURSE}
      LEFT JOIN ${TBL_LECTURER}
      ON ${TBL_COURSE}.lecturer = ${TBL_LECTURER}.username
      LEFT JOIN ${TBL_CATEGORY}
      ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
      ORDER BY numstudent DESC
      LIMIT 3`
    );
  },

  topTenMostView() {
    return db.load(
      `SELECT ${TBL_COURSE}.*, ${TBL_LECTURER}.name AS lecturername, ${TBL_CATEGORY}.name AS categoryname, ${TBL_CATEGORY}.id AS categoryid
      FROM ${TBL_COURSE}
      LEFT JOIN ${TBL_LECTURER}
      ON ${TBL_COURSE}.lecturer = ${TBL_LECTURER}.username
      LEFT JOIN ${TBL_CATEGORY}
      ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
      ORDER BY numview DESC
      LIMIT 10`
    );
  },

  topTenNewest() {
    return db.load(
      `SELECT ${TBL_COURSE}.*, ${TBL_LECTURER}.name AS lecturername, ${TBL_CATEGORY}.name AS categoryname, ${TBL_CATEGORY}.id AS categoryid
      FROM ${TBL_COURSE}
      LEFT JOIN ${TBL_LECTURER}
      ON ${TBL_COURSE}.lecturer = ${TBL_LECTURER}.username
      LEFT JOIN ${TBL_CATEGORY}
      ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
      ORDER BY id DESC
      LIMIT 10`
    );
  }
}