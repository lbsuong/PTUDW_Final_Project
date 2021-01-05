const db = require('../utils/db');
const TBL_CART = 'cart';

module.exports = {
    async cartByUsername(username) {
        return result = await db.load(`SELECT * FROM ${TBL_CART} WHERE studentid = '${username}'`);
    },

    addCourse(entity) {
        try {
            db.add(entity, TBL_CART);
        } catch (err) {
            console.log(err);
        }
        return;
    },

    async isExist(username, courseid) {
        let result = await db.load(`SELECT * FROM ${TBL_CART} WHERE studentid = '${username}' AND courseid = '${courseid}'`);
        console.log(result);

        if (result.length === 0) {
            return false;
        }
        return true;
    }
}