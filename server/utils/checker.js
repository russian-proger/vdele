const expressions = require('./expressions');

function IsValidMail(mail) {
    if (mail.length > 64) return false;
    return expressions.mail_expr.test(mail);
}

function IsInteger(s) {
    return (
        typeof(s) == 'number' ||
        typeof(s) == 'string' && expressions.int_expr.test(s)
    );
}

module.exports = ({
    IsValidMail,
    IsInteger
});