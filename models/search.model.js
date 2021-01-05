const db = require('../utils/db');
const courseModel = require('../models/course.model');
const categoryModel = require('./category.model');

const TBL_CATEGORY = 'category';
const TBL_COURSE = 'course';
const TBL_LECTURER = 'lecturer';

module.exports = {
  searchOnCourse(keywords) {
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
      ON T.categoryid = ${TBL_CATEGORY}.id`
    );
  },

  async searchOnCategory(keywords) {
    const result = [];
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

    for (category of searchResult) {
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
          result.push(course);
        }
      }
    }
    if (result.length === 0) {
      return null;
    }
    console.log(result);
    return result;
  }
};