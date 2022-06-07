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
            include: [{
                model: core.GetModel('UserProject'),
                attributes: ['right'],
                include: [{
                    model: core.GetModel('User'),
                    attributes: ['id', 'nick', 'mail', 'firstName', 'lastName', 'photoName'],
                }]
            }]
        });

        const users = project.UserProjects.map(v => ({
            right: v.right,
            ...v.dataValues.User.dataValues
        }));

        return res.send(JSON.stringify({result: true, data: users}));
    });
}