const db = require('../utils/db');

const TBL_COURSE = 'course';
const TBL_LECTURER = 'lecturer';

module.exports = {
  topThreeMostPopularInWeek() {
    return db.load(
      `SELECT ${TBL_COURSE}.*, ${TBL_LECTURER}.name
      FROM ${TBL_COURSE}
      LEFT JOIN ${TBL_LECTURER}
      ON ${TBL_COURSE}.lecturer = ${TBL_LECTURER}.username
      ORDER BY numstudent DESC
      LIMIT 3`
    );
  },

  topTenMostView() {
    return db.load(
      `SELECT ${TBL_COURSE}.*, ${TBL_LECTURER}.name
      FROM ${TBL_COURSE}
      LEFT JOIN ${TBL_LECTURER}
      ON ${TBL_COURSE}.lecturer = ${TBL_LECTURER}.username
      ORDER BY numview DESC
      LIMIT 10`
    );
  },

  topTenNewest() {
    return db.load(
      `SELECT ${TBL_COURSE}.*, ${TBL_LECTURER}.name
      FROM ${TBL_COURSE}
      LEFT JOIN ${TBL_LECTURER}
      ON ${TBL_COURSE}.lecturer = ${TBL_LECTURER}.username
      ORDER BY id DESC
      LIMIT 10`
    );
  }
}