module.exports = {
    random: function (length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    otp: function () {
        let otp_n = Math.random();
        otp_n = otp_n * 1000000;
        return parseInt(otp_n);
    },

}