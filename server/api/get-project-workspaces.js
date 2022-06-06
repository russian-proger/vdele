const Express = require('express');
const { CleanPlugin } = require('webpack');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/get_project_workspaces', async (req, res) => {

        if (!utils.checker.IsInteger(req.body.proj_id))
            return res.sendStatus(400);

        const workspaces = await core.GetModel('Workspace').findAll({
            where: {
                ProjectId: req.body.proj_id,
            }
        });

        return res.send(JSON.stringify({result: true, data: workspaces.map(v => v.dataValues)}));
    });
}