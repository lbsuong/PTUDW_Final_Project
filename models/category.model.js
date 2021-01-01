const db = require('../utils/db');

const TBL_CATEGORY = 'category';
const TBL_SUBCAT = 'subcat';

module.exports = {
  all() {
    return db.load(`select * from ${TBL_CATEGORY}`);
  },

  allCatIDByLevel(level) {
    return db.load(`select * from ${TBL_CATEGORY} where level = ${level}`);
  },

  subCatByID(id) {
    return db.load(`select id, name from (select * from ${TBL_SUBCAT} where parentid = ${id}) as T inner join ${TBL_CATEGORY} on T.subid = ${TBL_CATEGORY}.id`)
  }
}