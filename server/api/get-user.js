const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/get_user', async (req, res) => {
        console.log(req.body);
        // console.log(123);
        // if (utils.checker.IsInteger(req.body.user_id))
        //     return res.sendStatus(400);
        // const projects = await core.GetModel('User').findAll({
        //     where: {
        //         id: req.body.user_id
        //     },
        //     include: [{
        //         model: core.GetModel('Project')
        //     }]
        // }, );
        // console.log(projects)
        // // const rows = await getUserProjects(req.user_info.id, req.user_info.id != req.body.user_id);
        // return res.send(JSON.stringify({result: true, data: projects}));
    });
}