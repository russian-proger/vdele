const Express = require('express');
const { CleanPlugin } = require('webpack');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/get_organization_participants', async (req, res) => {

        if (!utils.checker.IsInteger(req.body.org_id))
            return res.sendStatus(400);

        const organization = await core.GetModel('Organization').findByPk(req.body.org_id);
        if (organization == null) {
            return res.send(JSON.stringify({result: false}));
        }

        const user_org = await core.GetModel('UserOrganization').findAll({
            where:{
                OrganizationId: req.body.org_id
            },
            include: [{
                attributes: ['id', 'nick', 'mail', 'firstName', 'lastName', 'photoName'],
                model: core.GetModel('User')
            }]
        });
        
        const users = user_org.map(v => ({right: v.dataValues.right, ...v.dataValues.User.dataValues}));
        
        return res.send(JSON.stringify({result: true, data: users}));
    });
}