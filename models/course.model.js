const db = require('../utils/db');
const categoryModel = require('../models/category.model');

const TBL_COURSE = 'course';
const TBL_LECTURER = 'lecturer';
const TBL_CATEGORY = 'category';

module.exports = {
  async singleByID(id) {
    const rows = await db.load(
      `SELECT ${TBL_COURSE}.*, ${TBL_LECTURER}.name AS lecturername, ${TBL_CATEGORY}.name AS categoryname, ${TBL_CATEGORY}.id AS categoryid
      FROM ${TBL_COURSE}
      LEFT JOIN ${TBL_LECTURER}
      ON ${TBL_COURSE}.lecturer = ${TBL_LECTURER}.username
      LEFT JOIN ${TBL_CATEGORY}
      ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
      WHERE ${TBL_COURSE}.id = ${id}`
    );
    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  },

  topThreeMostPopularInWeek() {
    return db.load(
      `SELECT ${TBL_COURSE}.*, ${TBL_LECTURER}.name AS lecturername, ${TBL_CATEGORY}.name AS categoryname, ${TBL_CATEGORY}.id AS categoryid
      FROM ${TBL_COURSE}
      LEFT JOIN ${TBL_LECTURER}
      ON ${TBL_COURSE}.lecturer = ${TBL_LECTURER}.username
      LEFT JOIN ${TBL_CATEGORY}
      ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
      ORDER BY numstudent DESC
      LIMIT 3`
    );
  },

  topTenMostView() {
    return db.load(
      `SELECT ${TBL_COURSE}.*, ${TBL_LECTURER}.name AS lecturername, ${TBL_CATEGORY}.name AS categoryname, ${TBL_CATEGORY}.id AS categoryid
      FROM ${TBL_COURSE}
      LEFT JOIN ${TBL_LECTURER}
      ON ${TBL_COURSE}.lecturer = ${TBL_LECTURER}.username
      LEFT JOIN ${TBL_CATEGORY}
      ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
      ORDER BY numview DESC
      LIMIT 10`
    );
  },

  topTenNewest() {
    return db.load(
      `SELECT ${TBL_COURSE}.*, ${TBL_LECTURER}.name AS lecturername, ${TBL_CATEGORY}.name AS categoryname, ${TBL_CATEGORY}.id AS categoryid
      FROM ${TBL_COURSE}
      LEFT JOIN ${TBL_LECTURER}
      ON ${TBL_COURSE}.lecturer = ${TBL_LECTURER}.username
      LEFT JOIN ${TBL_CATEGORY}
      ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
      ORDER BY id DESC
      LIMIT 10`
    );
  },

  async allByCategoryID(id) {
    const category = await categoryModel.singleByID(id);
    const result = [];
    if (category === null) {
      return null;
    }
    if (category.level === 1) {
      const subcat = await categoryModel.subCatByID(id);
      subcat.forEach(async function(value, index, array) {
        // console.log(value);
        const temp = await db.load(
          `SELECT ${TBL_COURSE}.*, ${TBL_CATEGORY}.id AS categoryid, ${TBL_CATEGORY}.name AS categoryname
          FROM ${TBL_COURSE}
          LEFT JOIN ${TBL_CATEGORY}
          ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
          WHERE ${TBL_COURSE}.categoryid = ${value.id}`
        );
        temp.forEach(function(value, index, array) {
          result.push(value);
        });
      });
    } else {
      const temp = await db.load(
        `SELECT ${TBL_COURSE}.*, ${TBL_CATEGORY}.id AS categoryid, ${TBL_CATEGORY}.name AS categoryname
        FROM ${TBL_COURSE}
        LEFT JOIN ${TBL_CATEGORY}
        ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
        WHERE ${TBL_COURSE}.categoryid = ${id}`
      );
      if (temp.length === 0) {
        return null
      }
      temp.forEach(function(value, index, array) {
        result.push(value);
      });
    }
    return result;
  },

  async addOneViewByID(id) {
    const rows = await db.load(
      `SELECT *
      FROM ${TBL_COURSE}
      WHERE id = ${id}`
    );
    if (rows.length === 0) {
      return;
    }

    const entity = rows[0];
    entity.numview++;
    const condition = {
      id: id
    };
    await db.patch(entity, condition, TBL_COURSE);
  }
}