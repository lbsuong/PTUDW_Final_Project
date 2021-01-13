const db = require('../utils/db');

const TBL_LESSON = 'lesson';

module.exports = {
    allByCourse(courseid) {
        return db.load(`SELECT * FROM ${TBL_LESSON} WHERE course = '${courseid}'`);
    },
    addLesson(entity) {
        return db.add(entity, TBL_LESSON);
    }
}