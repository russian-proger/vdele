const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/update_user_organization_right', async (req, res) => {

        if (
            !utils.checker.IsInteger(req.body.user_id) ||
            !utils.checker.IsInteger(req.body.org_id) ||
            !utils.checker.IsInteger(req.body.right)
        ) {      
            return res.sendStatus(400);
        }

        // User who request
        const client_user_org = await core.GetModel('UserOrganization').findOne({
            where: {
                UserId: req.user_info.id,
                OrganizationId: req.body.org_id
            }
        });

        // Who to change right
        const user_org = await core.GetModel('UserOrganization').findOne({
            where: {
                UserId: req.body.user_id,
                OrganizationId: req.body.org_id
            },
            include: [{
                model: core.GetModel('User')
            }]
        });

        if (
            user_org == null ||
            client_user_org == null ||
            client_user_org.dataValues.right >= user_org.dataValues.right) {
            return res.send(JSON.stringify({result: false}));
        } else {
            user_org.right = req.body.right;
            await user_org.save();
            return res.send(JSON.stringify({result: false, data: {right: user_org.dataValues.right, ...user_org.dataValues.User.dataValues}}));
        }
    });
}