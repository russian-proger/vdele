const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/new_task', async (req, res) => {

        if (
            !utils.checker.IsInteger(req.body.ws_id) ||
            !utils.checker.IsString(req.body.name) ||
            !utils.checker.IsString(req.body.descr)
        ) {      
            return res.sendStatus(400);
        }

        const task = await core.GetModel('Task').create({
            name: req.body.name,
            description: req.body.descr,
            status: 0,
            WorkspaceId: req.body.ws_id
        });

        return res.send(JSON.stringify({result: true, data: task}));
    });
}