const Express = require('express');
const { CleanPlugin } = require('webpack');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/enter_to_organization', async (req, res) => {

        if (!utils.checker.IsInteger(req.body.org_id))
            return res.sendStatus(400);

        const organization = await core.GetModel('Organization').findByPk(req.body.org_id);
        
        if (organization == null || !organization.dataValues.isPublic) {
            return res.send(JSON.stringify({result: false}));
        } else {
            const user_org = await core.GetModel('UserOrganization').create({
                UserId: req.user_info.id,
                OrganizationId: req.body.org_id,
                right: 2
            });
            console.log(user_org);

            return res.send(JSON.stringify({result: true, data: {...user_org}}));
        }
    });
}