DateDiff = {
    inHours: function (d1, d2) {
        return Math.floor((d2 - d1) / (3600 * 1000));
    },


    inDays: function (d1, d2) {
        return Math.floor((d2 - d1) / (24 * 3600 * 1000));
    },

    inWeeks: function (d1, d2) {
        return parseInt((d2 - d1) / (24 * 3600 * 1000 * 7));
    },

    inMonths: function (d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
    },

    inYears: function (d1, d2) {
        return d2.getFullYear() - d1.getFullYear();
    }
}

exports.DateDiff = DateDiff