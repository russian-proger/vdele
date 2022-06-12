const Express = require('express');
const { CleanPlugin } = require('webpack');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/remove_project_workspace', async (req, res) => {

        if (typeof(req.body.query) != 'string' || req.body.query.length > 100)
            return res.sendStatus(400);

        const workspace = await core.GetModel('Workspace').findByPk(req.body.ws_id);
        if (workspace != null) {
            const tasks = await core.GetModel('Task').findAll({
                attributes: ['id'],
                where: {
                    WorkspaceId: workspace.dataValues.id
                }
            });

            tasks.forEach(v => v.destroy());
    
            if (workspace != null) {
                workspace.destroy();
            }
        }


        return res.send(JSON.stringify({result: true}));
    });
}