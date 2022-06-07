const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/update_task', async (req, res) => {

        if (
            !utils.checker.IsInteger(req.body.task_id)
        ) {      
            return res.sendStatus(400);
        }

        const task = await core.GetModel('Task').findByPk(req.body.task_id);

        if (task == null) {
            return res.send(JSON.stringify({result: false, reason: 0}));
        } else {
            task.status = req.body.task.status;
            task.name   = req.body.task.name;
            task.description = req.body.task.description;
            task.save();
            return res.send(JSON.stringify({result: true, data: task}));
        }
    });
}