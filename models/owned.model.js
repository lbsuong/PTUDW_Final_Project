const db = require('../utils/db');
const { isExist } = require('./cart.model');
const { singleByUsername } = require('./user.model');
const TBL_OWNED = 'ownedcourse';
const TBL_COURSE = 'course';
const TBL_CATEGORY = 'category';
const TBL_LECTURER = 'lecturer';

module.exports = {
    add(entity) {
        return db.add(entity, TBL_OWNED);
    },

    async isExist(courseid, username) {
        let result = await db.load(`SELECT * FROM ${TBL_OWNED} WHERE userid = '${username}'
        AND courseid = '${courseid}'`);
        console.log(result);
        if (result.length === 0)
            return false;
        return true;
    },

    async singleByUsername(username, limit, offset) {
        let result = await db.load(`SELECT ${TBL_COURSE}.*, ${TBL_CATEGORY}.id AS categoryid ,
        ${TBL_CATEGORY}.name AS categoryname, ${TBL_LECTURER}.username AS lecturerid, 
        ${TBL_LECTURER}.name AS lecturername
        FROM ${TBL_OWNED} 
        LEFT JOIN ${TBL_COURSE} ON
        ${TBL_COURSE}.id = ${TBL_OWNED}.courseid 
        LEFT JOIN ${TBL_CATEGORY} ON
        ${TBL_COURSE}.categoryid = ${TBL_CATEGORY}.id
        LEFT JOIN ${TBL_LECTURER} ON
        ${TBL_LECTURER}.username = ${TBL_COURSE}.lecturer
        WHERE ${TBL_OWNED}.userid = '${username}'
        LIMIT ${limit} OFFSET ${offset}
        `)
        if (result.length === 0)
            return null;
        return result;
    },

    async countByUsername(username) {
        let result = await db.load(`SELECT * FROM ${TBL_OWNED} WHERE userid = '${username}'`);
        if (result === null)
            return 0;
        return result.length;
    }
}