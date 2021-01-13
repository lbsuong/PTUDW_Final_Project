const db = require('../utils/db');
const config = require('../config/default.json');

const TBL_LECTURER = 'lecturer';
const TBL_RATE = 'rating';
const TBL_COURSE = 'course';
const PRI_KEY = 'id';

module.exports = {
    recentlyById(id) {
        let row = db.load(`SELECT ${TBL_RATE}.*, ${TBL_COURSE}.* FROM ${TBL_RATE}
            LEFT JOIN ${TBL_COURSE} 
            ON ${TBL_RATE}.courseid = ${TBL_COURSE}.id
            WHERE ${TBL_RATE}.lecturer = '${id}'
            ORDER BY ${TBL_RATE}.date`);
        if (row.length === 0)
            return null;
        return row;
    }
}