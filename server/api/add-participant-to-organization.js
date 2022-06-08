const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/add_participant_to_organization', async (req, res) => {

        if (
            !utils.checker.IsInteger(req.body.org_id) ||
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

        const uo = await core.GetModel('UserOrganization').findOne({
            where: {
                UserId: user.id,
                OrganizationId: req.body.org_id
            }
        });

        if (uo != null) {
            return res.send(JSON.stringify({result: false, reason: 1}));
        }

        await core.GetModel('UserOrganization').create({
            UserId: user.dataValues.id,
            OrganizationId: req.body.org_id,
            right: 2
        });

        return res.send(JSON.stringify({result: true, data: {...user.dataValues, right: 2} }));
    });
}