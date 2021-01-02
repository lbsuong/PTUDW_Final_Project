const db = require('../utils/db');

const TBL_COURSE = 'course'

module.exports = {
  topThreeMostPopularInWeek() {
    return db.load(
      `SELECT *
      FROM ${TBL_COURSE}
      ORDER BY numstudent DESC
      LIMIT 3`
    );
  },

  topTenMostView() {
    return db.load(
      `SELECT *
      FROM ${TBL_COURSE}
      ORDER BY numview DESC
      LIMIT 10`
    );
  },

  topTenNewest() {
    return db.load(
      `SELECT *
      FROM ${TBL_COURSE}
      ORDER BY id DESC
      LIMIT 10`
    );
  }
}