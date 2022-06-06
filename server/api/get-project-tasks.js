const Express = require('express');
const { CleanPlugin } = require('webpack');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/get_project_tasks', async (req, res) => {

        if (!utils.checker.IsInteger(req.body.proj_id))
            return res.sendStatus(400);

        const workspaces = await core.GetModel('Workspace').findAll({
            attributes: ['id'],
            where: { ProjectId: req.body.proj_id }
        });

        const tasks = await core.GetModel('Task').findAll({
            where: {
                WorkspaceId: workspaces.map(v => v.dataValues.id),
            }
        });

        return res.send(JSON.stringify({result: true, data: tasks.map(v => v.dataValues)}));
    });
}