const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/remove_participant_from_organization', async (req, res) => {

        if (
            !utils.checker.IsInteger(req.body.org_id) ||
            !utils.checker.IsInteger(req.body.user_id)
        ) {      
            return res.sendStatus(400);
        }

        const user_org = await core.GetModel('UserOrganization').findOne({
            where: {
                UserId: req.body.user_id,
                OrganizationId: req.body.org_id
            }
        });
        
        if (user_org == null) {
            return res.send(JSON.stringify({result: false }));
        } else {
            await user_org.destroy();
            return res.send(JSON.stringify({result: true }));
        }
    });
}