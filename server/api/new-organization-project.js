const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/new_organization_project', async (req, res) => {

        if (
            !req.body.name ||
            !utils.expressions.orgname_expr.test(req.body.name) ||
            !utils.checker.IsString(req.body.privacy) ||
            !utils.checker.IsInteger(req.body.org_id)
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

        if (client_user_org != null && client_user_org.right < 2) {

            const proj = await core.GetModel('Project').create({
                name: req.body.name,
                isPublic: req.body.privacy == "public",
                OrganizationId: req.body.org_id
            });
    
            await core.GetModel('Workspace').create({
                name: "Пространство 1",
                ProjectId: proj.id
            });

            // Add all organization participants to the project
            // with the same rights
            const user_org = await core.GetModel('UserOrganization').findAll({
                where: {
                    OrganizationId: req.body.org_id,
                    right: (req.body.privacy == "public" ? [0,1,2] : [0,1])
                }
            });

            if (user_org != null) {
                user_org.forEach(async v => {
                    await core.GetModel('UserProject').create({
                        UserId: v.dataValues.UserId,
                        ProjectId: proj.id,
                        right: v.dataValues.right
                    })
                })
            }

            return res.send(JSON.stringify({result: true}));
            
        } else {
            return res.send(JSON.stringify({result: false}));
        }

    });
}