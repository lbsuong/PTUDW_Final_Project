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

  pageOnCourse(keywords, offset, sortType) {
    let column;
    let sort;
    if (sortType === 1) {
      column = 'rate';
      sort = 'DESC';
    } else if (sortType === 2) {
      column = 'promotionalprice';
      sort = 'ASC';
    }
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
      ORDER BY T.${column} ${sort}
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
          continue;
        }
        for (subCategory of subCat) {
          const allCoursesByCat = await courseModel.allByCategoryID(subCategory.id);
          if (allCoursesByCat.length === 0) {
            continue;
          }
          for (course of allCoursesByCat) {
            count++;
          }
        }
      } else {
        const allCoursesByCat = await courseModel.allByCategoryID(category.id);
        if (allCoursesByCat.length === 0) {
          continue;
        }
        for (course of allCoursesByCat) {
          count++;
        }
      }
    }
    return count;
  },

  async pageOnCategory(keywords, offset, sortType) {
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

    let allCourses = [];
    let result = [];
    let count = 0;
    for (category of searchResult) {
      if (category.level === 1) {
        subCat = await categoryModel.subCatByID(category.id)
        if (subCat.length === 0) {
          continue;
        }
        for (subCategory of subCat) {
          const allCoursesByCat = await courseModel.allByCategoryID(subCategory.id);
          if (allCoursesByCat.length === 0) {
            continue;
          }
          for (course of allCoursesByCat) {
            allCourses.push(course);
          }
        }
      } else {
        const allCoursesByCat = await courseModel.allByCategoryID(category.id, offset);
        if (allCoursesByCat === null) {
          continue;
        }
        for (course of allCoursesByCat) {
          allCourses.push(course);
        }
      }
    }
    if (sortType === 1) {
      allCourses.sort(function (a, b) {
        return b.rate - a.rate;
      });
    } else if (sortType === 2) {
      allCourses.sort(function (a, b) {
        return a.promotionalprice - b.promotionalprice;
      });
    }
    for (i = offset; i < allCourses.length; i++) {
      result.push(allCourses[i]);
      count++;
      if (count === config.pagination.limit) {
        break;
      }
    }
    return result;
  }
};