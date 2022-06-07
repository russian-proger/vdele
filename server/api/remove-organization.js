const Express = require('express');
const { CleanPlugin } = require('webpack');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/remove_organization', async (req, res) => {

        if (!utils.checker.IsInteger(req.body.org_id))
            return res.sendStatus(400);

        const organization = await core.GetModel('Organization').findByPk(req.body.org_id);

        // User who request
        const client_user_org = await core.GetModel('UserOrganization').findOne({
            where: {
                UserId: req.user_info.id,
                OrganizationId: req.body.org_id
            }
        });

        if (client_user_org == null || client_user_org.dataValues.right != 0) {
            return res.send(JSON.stringify({result: false}));
        }
        
        const projects = await core.GetModel('Project').findAll({
            where: {
                OrganizationId: req.body.org_id
            }
        });

        const user_org = await core.GetModel('UserOrganization').findAll({
            where: {
                OrganizationId: req.body.org_id
            }
        });

        user_org.forEach(v => v.destroy());

        projects.forEach(async (project) => {
            const workspaces = await core.GetModel('Workspace').findAll({
                attributes: ['id'],
                where: {
                    ProjectId: project.dataValues.id
                },
            });

            const user_projects = await core.GetModel('UserProject').findAll({
                where: {
                    ProjectId: project.dataValues.id
                }
            });

            user_projects.forEach(v => v.destroy());
    
            workspaces.forEach(async (v) => {
                const tasks = await core.GetModel('Task').findAll({
                    attributes: ['id'],
                    where: {
                        WorkspaceId: v.dataValues.id
                    }
                });
                tasks.forEach(v => v.destroy());
                v.destroy();
            });
    
            if (project != null) {
                project.destroy();
            }
        });

        organization.destroy();

        return res.send(JSON.stringify({result: true}));
    });
}