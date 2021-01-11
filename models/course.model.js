const db = require('../utils/db');
const categoryModel = require('../models/category.model');
const config = require('../config/default.json');

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
  addCourse(entity) {
    return db.add(entity, TBL_COURSE);
  },
  topMostPopularInAWeek(n) {
    return db.load(
      `SELECT ${TBL_COURSE}.*, ${TBL_LECTURER}.name AS lecturername, ${TBL_CATEGORY}.name AS categoryname, ${TBL_CATEGORY}.id AS categoryid
      FROM ${TBL_COURSE}
      LEFT JOIN ${TBL_LECTURER}
      ON ${TBL_COURSE}.lecturer = ${TBL_LECTURER}.username
      LEFT JOIN ${TBL_CATEGORY}
      ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
      ORDER BY numstudentinaweek DESC
      LIMIT ${n}`
    );
  },

  topMostPopularByCategory(n, catId, except) {
    return db.load(
      `SELECT ${TBL_COURSE}.*, ${TBL_LECTURER}.name AS lecturername, ${TBL_CATEGORY}.name AS categoryname, ${TBL_CATEGORY}.id AS categoryid
      FROM ${TBL_COURSE}
      LEFT JOIN ${TBL_LECTURER}
      ON ${TBL_COURSE}.lecturer = ${TBL_LECTURER}.username
      LEFT JOIN ${TBL_CATEGORY}
      ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
      WHERE ${TBL_COURSE}.categoryid = ${catId}
      AND ${TBL_COURSE}.id <> ${except}
      ORDER BY numstudent DESC
      LIMIT ${n}`
    );
  },

  topMostView(n) {
    return db.load(
      `SELECT ${TBL_COURSE}.*, ${TBL_LECTURER}.name AS lecturername, ${TBL_CATEGORY}.name AS categoryname, ${TBL_CATEGORY}.id AS categoryid
      FROM ${TBL_COURSE}
      LEFT JOIN ${TBL_LECTURER}
      ON ${TBL_COURSE}.lecturer = ${TBL_LECTURER}.username
      LEFT JOIN ${TBL_CATEGORY}
      ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
      ORDER BY numview DESC
      LIMIT ${n}`
    );
  },

  topNewest(n) {
    return db.load(
      `SELECT ${TBL_COURSE}.*, ${TBL_LECTURER}.name AS lecturername, ${TBL_CATEGORY}.name AS categoryname, ${TBL_CATEGORY}.id AS categoryid
      FROM ${TBL_COURSE}
      LEFT JOIN ${TBL_LECTURER}
      ON ${TBL_COURSE}.lecturer = ${TBL_LECTURER}.username
      LEFT JOIN ${TBL_CATEGORY}
      ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
      ORDER BY id DESC
      LIMIT ${n}`
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
      if (subcat.length === 0) {
        return result;
      }
      for (i = 0; i < subcat.length; i++) {
        const temp = await db.load(
          `SELECT ${TBL_COURSE}.*, ${TBL_CATEGORY}.id AS categoryid, ${TBL_CATEGORY}.name AS categoryname
          FROM ${TBL_COURSE}
          LEFT JOIN ${TBL_CATEGORY}
          ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
          WHERE ${TBL_COURSE}.categoryid = ${subcat[i].id}`
        );
        for (j = 0; j < temp.length; j++) {
          result.push(temp[j]);
        }
      }
    } else {
      const temp = await db.load(
        `SELECT ${TBL_COURSE}.*, ${TBL_CATEGORY}.id AS categoryid, ${TBL_CATEGORY}.name AS categoryname
        FROM ${TBL_COURSE}
        LEFT JOIN ${TBL_CATEGORY}
        ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
        WHERE ${TBL_COURSE}.categoryid = ${id}`
      );
      if (temp.length === 0) {
        return result;
      }
      for (i = 0; i < temp.length; i++) {
        result.push(temp[i]);
      }
    }
    return result;
  },

  async countByCategoryID(id) {
    const category = await categoryModel.singleByID(id);
    let count = 0;
    if (category === null) {
      return null;
    }

    if (category.level === 1) {
      const subcat = await categoryModel.subCatByID(id);
      if (subcat.length === 0) {
        return 0;
      }

      for (i = 0; i < subcat.length; i++) {
        const temp = await db.load(
          `SELECT COUNT(*) AS total
          FROM ${TBL_COURSE}
          WHERE ${TBL_COURSE}.categoryid = ${subcat[i].id}`
        );
        if (temp.length !== 0) {
          count += temp[0].total;
        }
      }
    } else {
      const temp = await db.load(
        `SELECT COUNT(*) AS total
        FROM ${TBL_COURSE}
        WHERE ${TBL_COURSE}.categoryid = ${id}`
      );
      count = temp[0].total;
    }
    return count;
  },

  async pageByCategoryID(id, offset) {
    const total = await this.countByCategoryID(id);
    if (offset >= total) {
      return null;
    }
    const category = await categoryModel.singleByID(id);
    const result = [];
    if (category === null) {
      return null;
    }
    if (category.level === 1) {
      const subcat = await categoryModel.subCatByID(id);
      if (subcat.length === 0) {
        return null;
      }
      let count = 0;
      for (i = 0; i < subcat.length; i++) {
        const temp = await db.load(
          `SELECT ${TBL_COURSE}.*, ${TBL_CATEGORY}.id AS categoryid, ${TBL_CATEGORY}.name AS categoryname
          FROM ${TBL_COURSE}
          LEFT JOIN ${TBL_CATEGORY}
          ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
          WHERE ${TBL_COURSE}.categoryid = ${subcat[i].id}`
        );
        let j = 0;
        if (offset <= temp.length) {
          j = offset
        }
        for (; j < temp.length; j++) {
          if (count < config.pagination.limit) {
            result.push(temp[j]);
            count++;
          }
        }
        if (count === config.pagination.limit) {
          break;
        }
      }
    } else {
      const temp = await db.load(
        `SELECT ${TBL_COURSE}.*, ${TBL_CATEGORY}.id AS categoryid, ${TBL_CATEGORY}.name AS categoryname
        FROM ${TBL_COURSE}
        LEFT JOIN ${TBL_CATEGORY}
        ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
        WHERE ${TBL_COURSE}.categoryid = ${id}
        LIMIT ${config.pagination.limit} OFFSET ${offset}`
      );
      if (temp.length === 0) {
        return null
      }
      for (i = 0; i < temp.length; i++) {
        result.push(temp[i]);
      }
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
  },

  async countOnCourse() {
    const result = await db.load(`SELECT COUNT(*) AS total FROM ${TBL_COURSE}`);
    if (result.length === 0) {
      return null;
    }
    return result[0].total;
  },

  pageOnCourse(offset) {
    return db.load(
      `SELECT ${TBL_COURSE}.*, ${TBL_LECTURER}.name AS lecturername, ${TBL_CATEGORY}.name AS categoryname, ${TBL_CATEGORY}.id AS categoryid
      FROM ${TBL_COURSE}
      LEFT JOIN ${TBL_LECTURER}
      ON ${TBL_COURSE}.lecturer = ${TBL_LECTURER}.username
      LEFT JOIN ${TBL_CATEGORY}
      ON ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
      LIMIT ${config.pagination.limit} OFFSET ${offset}`
    );
  }
}