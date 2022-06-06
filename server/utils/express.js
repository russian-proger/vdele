require('../specifications/api-types');
require('../specifications/types');

const { Op } = require('sequelize');
const fs = require('fs');

const core = require('../core');
const expressions = require('./expressions');

function SendView(response, view_name) {
    response.send(fs.readFileSync(`${__dirname}/../../views/${view_name}`).toString());
}


/**
 * Checks if form data is valid
 * @param {SignUpFormData} form
 * @returns 
 */
 async function IsValidSignUpForm(form) {
    const User = core.GetModel('User');

    if (
      !form.nick        ||
      !form.first_name  ||
      !form.last_name   ||
      !form.mail        ||
      !form.password    ||
      !form.repeat_password
    ) { return false; }
    if (form.password != form.repeat_password) {
      return false;
    }
  
    if (
      !expressions.uname_expr.test(form.first_name) ||
      !expressions.uname_expr.test(form.last_name)  ||
      !expressions.nick_expr .test(form.nick)       ||
      !expressions.pass_expr .test(form.password)
    ) { return false; }

    if (form.mail.length > 64 || !expressions.mail_expr.test(form.mail)) {
        return false;
    }
  
    if (await User.findOne({ 
        where: {
            [Op.or]: {
                nick: form.nick,
                mail: form.mail
            }
        }
    }) !== null) { return false; }
  
    return true;
  }
module.exports = ({
    IsValidSignUpForm,
    SendView
});