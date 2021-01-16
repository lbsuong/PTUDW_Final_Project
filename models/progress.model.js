const db = require('../utils/db');

const TBL_PROGRESS = 'progress';

module.exports = {
  add(username, courseid, lessonid) {
    const entity = {
      username,
      courseid,
      lessonid
    }
    return db.add(entity, TBL_PROGRESS);
  },

  getProcess(username, courseid) {
    return db.load(
      `SELECT *
      FROM ${TBL_PROGRESS}
      WHERE username = '${username}' AND courseid = '${courseid}'`
    );
  }
}