const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/get_user_projects', async (req, res) => {

        if (!utils.checker.IsInteger(req.body.user_id))
            return res.sendStatus(400);

        let projects = (await core.GetModel('User').findOne({
            attributes: ['id'],
            where: {
                id: req.body.user_id,
            },
            include: [{
                model: core.GetModel('Project'),
            }]
        }, )).dataValues.Projects.map(v => v.dataValues);
        
        if (req.body.user_id != req.user_info.id) {
            projects = projects.filter(v => v.isPublic);
        }
        

        return res.send(JSON.stringify({result: true, data: projects}));
    });
}