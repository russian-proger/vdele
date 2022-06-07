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
        const user_org = await core.GetModel('UserOrganization').findOne({
            UserId: req.user_info.id,
            OrgId: req.body.org_id
        });

        if (organization == null || (!organization.dataValues.isPublic && user_org == null)) {
            return res.send(JSON.stringify({result: false}));
        } else {
            const right = (user_org != null ? user_org.dataValues.right : 3);
            return res.send(JSON.stringify({result: true, data: {...organization.dataValues, right: right}}));
        }
    });
}