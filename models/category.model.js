const db = require('../utils/db');
const config = require('../config/default.json');

const TBL_CATEGORY = 'category';
const TBL_SUBCAT = 'subcat';
const TBL_COURSE = 'course';

module.exports = {
  all() {
    return db.load(`SELECT * FROM ${TBL_CATEGORY} WHERE level = '2'`);
  },

  allCategoryAtLevel(level) {
    return db.load(`SELECT * FROM ${TBL_CATEGORY} WHERE level = ${level}`);
  },

  async countOnCategory() {
    const result = await db.load(`SELECT COUNT(*) AS total FROM ${TBL_CATEGORY}`);
    return result[0].total;
  },

  pageOnCategory(offset) {
    return db.load(
      `SELECT *
      FROM ${TBL_CATEGORY}
      LIMIT ${config.paginationOnCategory.limit} OFFSET ${offset}`);
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

  async parentCatByID(id) {
    const result = await db.load(
      `SELECT ${TBL_CATEGORY}.*
      FROM (SELECT * FROM ${TBL_SUBCAT} WHERE subid = ${id}) AS T
      INNER JOIN ${TBL_CATEGORY}
      ON T.parentid = ${TBL_CATEGORY}.id`
    );
    if (result.length === 0) {
      return null;
    }
    return result[0];
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

  async singleByName(name) {
    const rows = await db.load(
      `SELECT *
      FROM ${TBL_CATEGORY}
      WHERE name = '${name}'`
    )
    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  },

  add(entity) {
    return db.add(entity, TBL_CATEGORY);
  },

  addCategoryRelationship(entity) {
    return db.add(entity, TBL_SUBCAT);
  },

  removeCategoryRelationship(entity) {
    return db.pool_query(`DELETE FROM ${TBL_SUBCAT} WHERE parentid = ${entity.parentid} AND subid = ${entity.subid}`)
  },

  changeInfo(id, newInfo) {
    const condition = { id: id };
    const newEntity = {
      name: newInfo.name,
      level: newInfo.level,
    };
    return db.patch(newEntity, condition, TBL_CATEGORY);
  },

  async changeCatFromLevelOneToLevelTwo(id, parentid) {
    const rows = await db.load(
      `SELECT *
      FROM ${TBL_SUBCAT}
      RIGHT JOIN ${TBL_CATEGORY}
      ON ${TBL_SUBCAT}.subid = ${TBL_CATEGORY}.id
      WHERE parentid = ${id}`
    );
    for (category of rows) {
      const entity = { level: 1 };
      const condition = { id: category.id }
      await db.patch(entity, condition, TBL_CATEGORY);
    }
    const targetCategory = await this.singleByID(id);
    targetCategory.level = 2;
    await this.addCategoryRelationship({
      parentid: parentid,
      subid: id
    });
    const condition = { parentid: id };
    await db.del(condition, TBL_SUBCAT);
  },

  deleteCategory(id) {
    const condition = { id: id };
    return db.del(condition, TBL_CATEGORY);
  },

  async deleteCategoryWithLevelOne(id) {
    const rows = await db.load(
      `SELECT *
      FROM ${TBL_SUBCAT}
      RIGHT JOIN ${TBL_CATEGORY}
      ON ${TBL_SUBCAT}.subid = ${TBL_CATEGORY}.id
      WHERE parentid = ${id}`
    );
    for (category of rows) {
      const entity = { level: 1 };
      const condition = { id: category.id }
      await db.patch(entity, condition, TBL_CATEGORY);
    }
    const condition = { parentid: id };
    await db.del(condition, TBL_SUBCAT);
    await this.deleteCategory(id);
  },

  async canBeDeleted(id) {
    const result = await db.load(`SELECT * FROM ${TBL_COURSE} WHERE categoryid = ${id}`);
    if (result.length === 0) {
      return true;
    }
    return false;
  },

  async getLastID() {
    const result = await db.load(`SELECT * FROM ${TBL_CATEGORY} WHERE id = (SELECT MAX(id) FROM ${TBL_CATEGORY})`)
    if (result.length === 0) {
      return null;
    }
    return result[0].id;
  }
}