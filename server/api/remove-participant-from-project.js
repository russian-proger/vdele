const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/remove_participant_from_project', async (req, res) => {

        if (
            !utils.checker.IsInteger(req.body.proj_id) ||
            !utils.checker.IsInteger(req.body.user_id)
        ) {      
            return res.sendStatus(400);
        }

        const user_project = await core.GetModel('UserProject').findOne({
            where: {
                UserId: req.body.user_id,
                ProjectId: req.body.proj_id
            }
        });
        
        if (user_project == null) {
            return res.send(JSON.stringify({result: false }));
        } else {
            await user_project.destroy();
            return res.send(JSON.stringify({result: true }));
        }
    });
}