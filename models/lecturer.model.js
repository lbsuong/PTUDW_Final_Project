const db = require('../utils/db');
const config = require('../config/default.json');

const TBL_LECTURER = 'lecturer';
const TBL_COURSE = 'course';
const PRI_KEY = 'username';
const TBL_CATEGORY = 'category';

module.exports = {
  all() {
    return db.load(`SELECT * FROM ${TBL_LECTURER}`);
  },
  changeBank(bankid, bankname, id) {
    db.update(bankid, 'bankid', PRI_KEY, id, TBL_LECTURER);
    return db.update(bankname, 'bankname', PRI_KEY, id, TBL_LECTURER);
  },

  changeInfo(name, email, id) {
    db.update(name, 'name', PRI_KEY, id, TBL_LECTURER);
    return db.update(email, 'email', PRI_KEY, id, TBL_LECTURER);
  },
  changePicture(picture, id) {
    return db.update(picture, 'picture', PRI_KEY, id, TBL_LECTURER);
  },
  async singleByUsername(username) {
    const rows = await db.load(`SELECT * FROM ${TBL_LECTURER} WHERE username = '${username}'`);
    if (rows.length == 0)
      return null;
    return rows[0];
  },

  add(entity) {
    return db.add(entity, TBL_LECTURER);
  },

  async countOnLecturer() {
    const result = await db.load(`SELECT COUNT(*) AS total FROM ${TBL_LECTURER}`);
    return result[0].total;
  },

  pageOnLecturer(offset) {
    return db.load(
      `SELECT *
      FROM ${TBL_LECTURER}
      LIMIT ${config.paginationOnLecturer.limit} OFFSET ${offset}`);
  },

  changeProfile(newEntity) {
    const condition = { username: newEntity.username };
    return db.patch(newEntity, condition, TBL_LECTURER);
  },

  deleteAccount(username) {
    const condition = { username: username };
    return db.del(condition, TBL_LECTURER);
  },

  changePassword(newPass, id) {
    return db.update(newPass, 'password', PRI_KEY, id, TBL_LECTURER);
  },

  async getOwnCourse(lecturerid, courseid) {
    let result = await db.load(
      `SELECT  ${TBL_COURSE}.*, ${TBL_CATEGORY}.name AS categoryname 
    FROM ${TBL_COURSE}
    LEFT JOIN ${TBL_CATEGORY}
    ON ${TBL_CATEGORY}.id = ${TBL_COURSE}.categoryid
    WHERE ${TBL_COURSE}.id = '${courseid}' AND ${TBL_COURSE}.lecturer = '${lecturerid}'`);
    if (result.length === 0)
      return null;
    return result[0];
  }
};