const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/remove_task', async (req, res) => {

        if (
            !utils.checker.IsInteger(req.body.task_id)
        ) {      
            return res.sendStatus(400);
        }

        const task = await core.GetModel('Task').findByPk(req.body.task_id);
        if (task == null) {
            return res.send(JSON.stringify({result: false, reason: 0}));
        } else {
            task.destroy();
            return res.send(JSON.stringify({result: true}));
        }
    });
}