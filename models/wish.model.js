const db = require('../utils/db');
const { singleByID } = require('./category.model');
const { singleByUsername } = require('./user.model');

const TBL_WISH = 'wish';
const TBL_COURSE = 'course';

module.exports = {
    singleByUsername(username) {
        return db.load(`SELECT ${TBL_COURSE}.* FROM ${TBL_WISH}
        LEFT JOIN ${TBL_COURSE}
        ON ${TBL_COURSE}.id = ${TBL_WISH}.courseid
        WHERE ${TBL_WISH}.studentid = '${username}'`)
    },
    deleteByCourseID(courseid) {
        condition = {
            courseid: courseid
        };
        return db.del(condition, TBL_WISH);
    },

    add(entity) {
        return db.add(entity, TBL_WISH);
    },

    async isExist(username, courseid) {
        let result = await db.load(`SELECT * FROM ${TBL_WISH} WHERE studentid = '${username}' AND courseid = '${courseid}'`);
        console.log(result);

        if (result.length === 0) {
            return false;
        }
        return true;
    }
};