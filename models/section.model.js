const db = require('../utils/db');

const TBL_SECTION = 'section';
const TBL_COURSE_SECTION = 'course_section';

module.exports = {
  allSectionByCourseID(id) {
    return db.load(
      `SELECT *
      FROM (SELECT *
      FROM ${TBL_COURSE_SECTION}
      WHERE courseid = ${id}) AS T
      INNER JOIN ${TBL_SECTION}
      ON T.sectionid = ${TBL_SECTION}.id`
    );
  }
}