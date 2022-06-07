const Express = require('express');
const { CleanPlugin } = require('webpack');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/get_project_participants', async (req, res) => {

        if (!utils.checker.IsInteger(req.body.proj_id))
            return res.sendStatus(400);

        const project = await core.GetModel('Project').findOne({
            where: { id: req.body.proj_id },
            include: [core.GetModel('User')]
        });

        return res.send(JSON.stringify({result: true, data: project.Users.map(v => v.dataValues)}));
    });
}