const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/get_user', async (req, res) => {
        if (!utils.checker.IsInteger(req.body.user_id))
            return res.sendStatus(400);

        const user = await core.GetModel('User').findByPk(req.body.user_id);
        
        if (user == null) {
            return res.send(JSON.stringify({result: false}));
        } else {
            return res.send(JSON.stringify({result: true, data: user.dataValues}));
        }
    });
}