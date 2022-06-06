const expressions = require('./expressions');

function IsValidMail(mail) {
    if (mail.length > 64) return false;
    return expressions.mail_expr.test(mail);
}

function IsInteger(val) {
    return (
        typeof(val) == 'number' ||
        typeof(val) == 'string' && expressions.int_expr.test(s)
    );
}

function IsString(val) {
    return typeof(val) == 'string';
}

module.exports = ({
    IsValidMail,
    IsInteger,
    IsString
});