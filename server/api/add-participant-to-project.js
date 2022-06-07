const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/add_participant_to_project', async (req, res) => {

        if (
            !utils.checker.IsInteger(req.body.proj_id) ||
            !utils.checker.IsString(req.body.nick)
        ) {      
            return res.sendStatus(400);
        }

        const user = await core.GetModel('User').findOne({
            where: {
                nick: req.body.nick
            }
        });

        if (user == null) {
            return res.send(JSON.stringify({result: false, reason: 0 }));
        }

        const up = await core.GetModel('UserProject').findOne({
            where: {
                UserId: user.id,
                ProjectId: req.body.proj_id,
                right: 1
            }
        });

        if (up != null) {
            return res.send(JSON.stringify({result: false, reason: 1}));
        }

        await core.GetModel('UserProject').create({
            UserId: user.dataValues.id,
            ProjectId: req.body.proj_id
        });

        return res.send(JSON.stringify({result: true, data: user.dataValues }));
    });
}