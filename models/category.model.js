const db = require('../utils/db');

const TBL_CATEGORY = 'category';
const TBL_SUBCAT = 'subcat';

module.exports = {
  all() {
    return db.load(`SELECT * FROM ${TBL_CATEGORY}`);
  },

  allCatIDByLevel(level) {
    return db.load(`SELECT * FROM ${TBL_CATEGORY} WHERE LEVEL = ${level}`);
  },

  subCatByID(id) {
    return db.load(
      `SELECT ${TBL_CATEGORY}.*
      FROM (SELECT * FROM ${TBL_SUBCAT} WHERE parentid = ${id}) AS T
      INNER JOIN ${TBL_CATEGORY}
      ON T.subid = ${TBL_CATEGORY}.id`
    )
  },

  parentCatByID(id) {
    return db.load(
      `SELECT ${TBL_CATEGORY}.*
      FROM (SELECT * FROM ${TBL_SUBCAT} WHERE subid = ${id}) AS T
      INNER JOIN ${TBL_CATEGORY}
      ON T.parentid = ${TBL_CATEGORY}.id`
    )
  },

  topMostCount(n) {
    return db.load(
      `SELECT *
      FROM ${TBL_CATEGORY}
      ORDER BY countinaweek DESC
      LIMIT ${n}`
    )
  },

  async singleByID(id) {
    const rows = await db.load(
      `SELECT *
      FROM ${TBL_CATEGORY}
      WHERE id = ${id}`
    )
    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  },
}