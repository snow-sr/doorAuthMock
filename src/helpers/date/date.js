const { toZonedTime, format } = require("date-fns-tz");

const timezone = "America/Sao_Paulo";
function dateFormat(date) {
    try {
        const zonedDate = toZonedTime(date, timezone);
        return format(zonedDate, "yyyy-MM-dd HH:mm:ssXXX", { timeZone: timezone });
    }
    catch (error) {
        console.error(error);
        return error.message;
    }
}

module.exports = { dateFormat };