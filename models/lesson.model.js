const db = require('../utils/db');

const TBL_LESSON = 'lesson';

module.exports = {
    async singleByID(lessonid, courseid) {
        const result = await db.load(`SELECT * FROM ${TBL_LESSON} WHERE course = ${courseid} AND id = ${lessonid}`);
        if (result.length === 0) {
            return null;
        }
        return result[0];
    },

    allByCourse(courseid) {
        return db.load(`SELECT * FROM ${TBL_LESSON} WHERE course = '${courseid}'`);
    },

    addLesson(entity) {
        return db.add(entity, TBL_LESSON);
    }
}