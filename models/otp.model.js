const { del } = require('../utils/db');
const db = require('../utils/db');
const { get } = require('../utils/mail');

const TBL_OTP = 'otp';

module.exports = {
    async add(entity) {
        let result = await this.get(entity.username);
        if (result === null)
            return await db.add(entity, TBL_OTP);
        else {
            this.updateOTP(entity);
        }
    },
    async get(user) {
        let result = await db.load(`SELECT * FROM ${TBL_OTP} WHERE username = '${user}'`);
        if (result.length === 0)
            return null;
        return result[0];
    },
    async updateOTP(entity) {
        condition = {
            username: entity.username,
        }
        return await db.patch(entity, condition, TBL_OTP);
    },

    async del(user) {
        condition = {
            username: user,
        }
        return await db.del(condition, TBL_OTP);
    },
    async calSecond(date, currentDate) {
        let result = await db.load(`SELECT TIMESTAMPDIFF(SECOND,'${date}','${currentDate}') AS time`);
        return result[0].time;
    }
}