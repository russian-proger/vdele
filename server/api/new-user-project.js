const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/new_user_project', async (req, res) => {

        if (
            !req.body.name ||
            !utils.expressions.orgname_expr.test(req.body.name) ||
            !utils.checker.IsString(req.body.privacy)
        ) {      
            return res.sendStatus(400);
        }

        const proj = await core.GetModel('Project').create({
            name: req.body.name,
            isPublic: req.body.privacy == "public"
        });

        await core.GetModel('UserProject').create({
            UserId: req.user_info.id,
            ProjectId: proj.id,
            right: 0
        });

        await core.GetModel('Workspace').create({
            name: "Пространство 1",
            ProjectId: proj.id
        });

        return res.send(JSON.stringify({result: true}));
    });
}