const db = require('../utils/db');
const config = require('../config/default.json');

const TBL_LECTURER = 'lecturer';
const TBL_RATING = 'rating';
const TBL_COURSE = 'course';
const PRI_KEY = 'id';

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

    async isAlreadyRated(username) {
        const result = await db.load(`SELECT * FROM ${TBL_RATING} userid = '${username}'`);
        if (result.length === 0) {
            return false;
        }
        return true;
    }
}