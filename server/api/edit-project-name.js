const Express = require('express');
const { CleanPlugin } = require('webpack');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/change_project_name', async (req, res) => {
        if (
            !utils.checker.IsInteger(req.body.proj_id) ||
            !utils.checker.IsString(req.body.name)
        ) return res.sendStatus(400);
        
        const project = await core.GetModel('Project').findByPk(req.body.proj_id);
        project.name = req.body.name;
        await project.save({
            fields: ['name']
        });

        return res.send(JSON.stringify({result: true}));
    });
}