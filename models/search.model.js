const db = require('../utils/db');
const courseModel = require('../models/course.model');
const categoryModel = require('./category.model');
const config = require('../config/default.json');

const TBL_CATEGORY = 'category';
const TBL_COURSE = 'course';
const TBL_LECTURER = 'lecturer';

module.exports = {
  async countOnCourse(keywords) {
    const count = await db.load(
      `SELECT COUNT(*) AS total
      FROM ${TBL_COURSE}
      WHERE
        MATCH(title)
        AGAINST('${keywords}*' IN BOOLEAN MODE)`
    );
    return count[0].total;
  },

  pageOnCourse(keywords, offset) {
    return db.load(
      `SELECT T.*, ${TBL_LECTURER}.name AS lecturername, ${TBL_CATEGORY}.name AS categoryname, ${TBL_CATEGORY}.id AS categoryid
      FROM (SELECT *
            FROM ${TBL_COURSE}
            WHERE
              MATCH(title)
              AGAINST('${keywords}*' IN BOOLEAN MODE)) AS T
      LEFT JOIN ${TBL_LECTURER}
      ON T.lecturer = ${TBL_LECTURER}.username
      LEFT JOIN ${TBL_CATEGORY}
      ON T.categoryid = ${TBL_CATEGORY}.id
      LIMIT ${config.pagination.limit} OFFSET ${offset}`
    );
  },

  async countOnCategory(keywords) {
    let count = 0;
    const searchResult = await db.load(
      `SELECT *
      FROM ${TBL_CATEGORY}
      WHERE
        MATCH(name)
        AGAINST('${keywords}*' IN BOOLEAN MODE)`
    );

    if (searchResult.length === 0) {
      return 0;
    }

    for (category of searchResult) {
      if (category.level === 1) {
        subCat = await categoryModel.subCatByID(category.id)
        if (subCat.length === 0) {
          break;
        }
        for (subCategory of subCat) {
          const temp = await courseModel.allByCategoryID(subCategory.id);
          if (temp === null) {
            continue;
          }
          for (course of temp) {
            count++;
          }
        }
      } else {
        const temp = await courseModel.allByCategoryID(category.id);
        if (temp === null) {
          break;
        }
        for (course of temp) {
          count++;
        }
      }
    }
    return count;
  },

  async pageOnCategory(keywords, offset) {
    const searchResult = await db.load(
      `SELECT *
      FROM ${TBL_CATEGORY}
      WHERE
        MATCH(name)
        AGAINST('${keywords}*' IN BOOLEAN MODE)`
    );

    if (searchResult.length === 0) {
      return null;
    }

    let result = [];
    let count = 0;
    for (category of searchResult) {
      if (category.level === 1) {
        subCat = await categoryModel.subCatByID(category.id)
        if (subCat.length === 0) {
          break;
        }
        for (subCategory of subCat) {
          const temp = await courseModel.allByCategoryID(subCategory.id);
          if (temp === null) {
            continue;
          }
          let i = 0;
          if (offset <= temp.length) {
            i = offset;
          }
          for (; i < temp.length; i++) {
            result.push(course);
            count++;
            if (count === config.pagination.limit) {
              return result;
            }
          }
        }
      } else {
        result = await courseModel.pageByCategoryID(category.id, offset);
        if (result.length === 0) {
          return null;
        }
        return result;
      }
    }
    if (result.length === 0) {
      return null;
    }
    return result;
  }
};