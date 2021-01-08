const db = require('../utils/db');
const config = require('../config/default.json');
const bcrypt = require('bcryptjs');

const TBL_LECTURER = 'lecturer';
const PRI_KEY = 'username';

module.exports = {
  all() {
    return db.load(`SELECT * FROM ${TBL_LECTURER}`);
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

  changeProfile(username, newInfo) {
    const condition = { username: username };
    const newEntity = {
      username: username,
      password: bcrypt.hashSync(newInfo.password, 10),
      name: newInfo.name,
      email: newInfo.email,
      bankid: newInfo.bankid,
      bankname: newInfo.bankname
    };
    return db.patch(newEntity, condition, TBL_LECTURER);
  },

  deleteAccount(username) {
    const condition = { username: username };
    return db.del(condition, TBL_LECTURER);
  },

  changePassword(newPass, id) {
    return db.update(newPass, 'password', PRI_KEY, id, TBL_LECTURER);
  },
};