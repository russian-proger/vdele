const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/new_project_workspace', async (req, res) => {

        if (
            !utils.checker.IsInteger(req.body.proj_id) ||
            !utils.checker.IsString(req.body.name)
        ) return res.sendStatus(400);

        const workspace = await core.GetModel('Workspace').create({
            name: req.body.name,
            ProjectId: req.body.proj_id
        });

        return res.send(JSON.stringify({result: true, data: workspace.dataValues}));
    });
}