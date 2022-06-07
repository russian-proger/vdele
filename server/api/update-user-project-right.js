const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/update_user_project_right', async (req, res) => {

        if (
            !utils.checker.IsInteger(req.body.user_id) ||
            !utils.checker.IsInteger(req.body.proj_id) ||
            !utils.checker.IsInteger(req.body.right)
        ) {      
            return res.sendStatus(400);
        }

        // User who request
        const client_user_project = await core.GetModel('UserProject').findOne({
            where: {
                UserId: req.user_info.id,
                ProjectId: req.body.proj_id
            }
        });

        // Who to change right
        const user_project = await core.GetModel('UserProject').findOne({
            where: {
                UserId: req.body.user_id,
                ProjectId: req.body.proj_id
            },
            include: [{
                model: core.GetModel('User')
            }]
        });

        if (
            user_project == null ||
            client_user_project == null ||
            client_user_project.dataValues.right >= user_project.dataValues.right) {
            return res.send(JSON.stringify({result: false}));
        } else {
            user_project.right = req.body.right;
            await user_project.save();
            return res.send(JSON.stringify({result: false, data: {right: user_project.dataValues.right, ...user_project.dataValues.User.dataValues}}));
        }
    });
}