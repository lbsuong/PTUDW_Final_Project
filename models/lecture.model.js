const db = require('../utils/db');

const TBL_LECTURE = 'lecture';
const TBL_SECTION_LECTURE = 'section_lecture';
const TBL_COURSE_SECTION = 'course_section'

module.exports = {
  async singleByID(courseid, lectureid) {
    const result = await db.load(
      `SELECT ${TBL_LECTURE}.*
      FROM (SELECT lectureid
            FROM (SELECT *
                  FROM ${TBL_COURSE_SECTION}
                  WHERE courseid = ${courseid}) AS T
            INNER JOIN ${TBL_SECTION_LECTURE}
            ON ${TBL_SECTION_LECTURE}.sectionid = T.sectionid) AS Y
      INNER JOIN ${TBL_LECTURE}
      ON ${TBL_LECTURE}.id = Y.lectureid
      WHERE id = ${lectureid}`
    );
    if (result.length === 0) {
      return null;
    }
    return result[0];
  },

  allLectureBySectionID(id) {
    return db.load(
      `SELECT ${TBL_LECTURE}.*
      FROM (SELECT *
      FROM ${TBL_SECTION_LECTURE}
      WHERE sectionid = ${id}) AS T
      INNER JOIN ${TBL_LECTURE}
      ON T.lectureid = ${TBL_LECTURE}.id`
    );
  }
}