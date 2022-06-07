const Express = require('express');
const { CleanPlugin } = require('webpack');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/get_organization_projects', async (req, res) => {

        if (!utils.checker.IsInteger(req.body.org_id))
            return res.sendStatus(400);

        const organization = await core.GetModel('Organization').findByPk(req.body.org_id);
        if (organization == null) {
            return res.send(JSON.stringify({result: false}));
        }

        const user_org = await core.GetModel('UserOrganization').findOne({
            where:{
                UserId: req.user_info.id,
                OrganizationId: req.body.org_id
            }
        });
        
        let org_projects = await core.GetModel('Project').findAll({
            where: {
                isPublic: (user_org == null || user_org.dataValues.right > 1 ? [1] : [0, 1]),
                OrganizationId: req.body.org_id
            }
        });

        return res.send(JSON.stringify({result: true, data: org_projects}));
    });
}