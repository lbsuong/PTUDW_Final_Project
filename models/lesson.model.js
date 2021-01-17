const db = require('../utils/db');

const TBL_LESSON = 'lesson';

module.exports = {
    async singleByID(lessonid) {
        const result = await db.load(`SELECT * FROM ${TBL_LESSON} WHERE id = ${lessonid}`);
        if (result.length === 0) {
            return null;
        }
        return result[0];
    },

    allByCourse(courseid) {
        return db.load(
            `SELECT *
            FROM ${TBL_LESSON}
            WHERE course = ${courseid}
            ORDER BY \`rank\` ASC`
        );
    },

    addLesson(entity) {
        return db.add(entity, TBL_LESSON);
    },

    delById(id) {
        condition = {
            id: id,
        }
        return db.del(condition, TBL_LESSON);
    },

    changeInfo(newEntity) {
        const condition = { id: newEntity.id };
        return db.patch(newEntity, condition, TBL_LESSON);
    },

    async getFirstLessonID(courseid) {
        const firstLesson = await db.load(
            `SELECT id
            FROM ${TBL_LESSON}
            WHERE course = ${courseid}
            ORDER BY \`rank\` ASC
            LIMIT 1`
        );
        if (firstLesson.length === 0) {
            return null;
        }
        return firstLesson[0].id;
    }
}