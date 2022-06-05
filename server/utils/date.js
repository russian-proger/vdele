
/**
 * format from js date object into mysql datetime
 * @param {Date} date 
 * @returns {string}
 */
 function ConvertDate2DateTime(date) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

module.exports = ({
    ConvertDate2DateTime
});