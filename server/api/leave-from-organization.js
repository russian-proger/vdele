const Express = require('express');
const { CleanPlugin } = require('webpack');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/leave_from_organization', async (req, res) => {

        if (!utils.checker.IsInteger(req.body.org_id))
            return res.sendStatus(400);

        const organization = await core.GetModel('Organization').findByPk(req.body.org_id);
        const user_org = await core.GetModel('UserOrganization').findOne({
            where: {
                UserId: req.user_info.id,
                OrganizationId: req.body.org_id
            }
        });

        if (organization == null || user_org == null) {
            return res.send(JSON.stringify({result: false}));
        } else {
            user_org.destroy();
            return res.send(JSON.stringify({result: true}));
        }
    });
}