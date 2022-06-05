const expressions = require('./expressions');

function IsValidMail(mail) {
    if (mail.length > 64) return false;
    return expressions.mail_expr.test(mail);
}

module.exports = ({
    IsValidMail
});