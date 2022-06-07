const Express = require('express');
const { CleanPlugin } = require('webpack');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/remove_project', async (req, res) => {

        if (!utils.checker.IsInteger(req.body.proj_id))
            return res.sendStatus(400);

        const project = await core.GetModel('Project').findByPk(req.body.proj_id);
        const workspaces = await core.GetModel('Workspace').findAll({
            attributes: ['id'],
            where: {
                ProjectId: project.id
            },
        });

        workspaces.forEach(async (v) => {
            const tasks = await core.GetModel('Task').findAll({
                attributes: ['id'],
                where: {
                    WorkspaceId: v.dataValues.id
                }
            });
            tasks.forEach(v => v.destroy());
            v.destroy();
        });

        if (project != null) {
            project.destroy();
        }

        return res.send(JSON.stringify({result: true}));
    });
}