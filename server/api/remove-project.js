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

        if (project != null) {
            project.destroy();
        }

        return res.send(JSON.stringify({result: true}));
    });
}