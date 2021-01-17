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
    },
    async isAvailableRank(idx, courseid) {
        let answer = await db.load(`SELECT * FROM ${TBL_LESSON} WHERE course = ${courseid} AND ${TBL_LESSON}.rank = ${idx}`);
        if (answer.length === 0)
            return true;
        return false;
    },

    async getAvailableRank(courseid) {
        let ans = [];
        let result = await db.load(`SELECT MAX(${TBL_LESSON}.rank) AS maxrank
        FROM ${TBL_LESSON} WHERE course = ${courseid}`);
        let maxrank = result[0].maxrank;
        if (maxrank === null)
            maxrank = 1;

        for (i = 1; i <= maxrank; i++) {
            let check = await this.isAvailableRank(i, courseid);
            if (check)
                ans.push(i);
        }

        for (i = maxrank + 1; i < maxrank + 5; i++) {

            ans.push(i);
        }
        console.log(ans)
        return ans;
    }
}