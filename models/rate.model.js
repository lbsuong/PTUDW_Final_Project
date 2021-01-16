const db = require('../utils/db');
const config = require('../config/default.json');
const courseModel = require('../models/course.model');

const TBL_RATING = 'rating';
const TBL_COURSE = 'course';
const TBL_USERS = 'users';

module.exports = {
    async recentlyById(id) {
        let row = await db.load(`SELECT ${TBL_RATING}.*, ${TBL_COURSE}.title AS coursetitle FROM ${TBL_RATING}
            LEFT JOIN ${TBL_COURSE} 
            ON ${TBL_RATING}.courseid = ${TBL_COURSE}.id
            WHERE ${TBL_COURSE}.lecturer = '${id}'
            ORDER BY ${TBL_RATING}.date 
            LIMIT 10 OFFSET 0`);
        if (row.length === 0)
            return null;
        return row;
    },

    add(comment, rate, courseid, studentid) {
        const dateNow = new Date().toISOString().slice(0, 19).replace('T', ' ');
        return db.add({
            ratedetail: comment,
            rate: rate,
            courseid: courseid,
            studentid: studentid,
            date: dateNow
        }, TBL_RATING);
    },

    async isAlreadyRated(username, courseid) {
        const result = await db.load(`SELECT * FROM ${TBL_RATING} WHERE studentid = '${username}' AND courseid = ${courseid}`);
        if (result.length === 0) {
            return false;
        }
        return true;
    },

    pageOnRatingByCourseID(id, offset) {
        return db.load(
            `SELECT ${TBL_RATING}.*, ${TBL_USERS}.username, ${TBL_USERS}.picture
            FROM ${TBL_RATING}
            INNER JOIN ${TBL_USERS}
            ON ${TBL_RATING}.studentid = ${TBL_USERS}.username
            WHERE courseid = ${id}
            LIMIT ${config.paginationOnRatingDetail.limit} OFFSET ${offset}`
        )
    },

    async addNumRate(courseid, n) {
        const entity = await courseModel.singleByIDNoAdditional(courseid);
        entity.numrate += n;
        const condition = { id: courseid };
        return db.patch(entity, condition, TBL_COURSE);
    },

    async calRate(courseid) {
        const entity = await courseModel.singleByIDNoAdditional(courseid);
        const result = await db.load(
            `SELECT AVG(rate) AS avgrate
            FROM ${TBL_RATING}
            WHERE courseid = ${courseid}`
        );
        if (result.length === 0) {
            return null;
        }
        entity.rate = result[0].avgrate;
        const condition = { id: courseid };
        return db.patch(entity, condition, TBL_COURSE);
    }
}