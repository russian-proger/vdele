const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/new_organization', async (req, res) => {

        if (
            !req.body.name ||
            !utils.expressions.orgname_expr.test(req.body.name) ||
            !utils.checker.IsString(req.body.privacy)
        ) {      
            return res.sendStatus(400);
        }

        const photoName = Date.now().toString() + parseInt(Math.random() * 5000000).toString() + req.body.name + '.png';
        await utils.image.GenerateRandomImage(__dirname + `/../../resources/organization_photos/${photoName}`)

        const org = await core.GetModel('Organization').create({
            name: req.body.name,
            isPublic: req.body.privacy == "public",
            photoName
        });

        await core.GetModel('UserOrganization').create({
            UserId: req.user_info.id,
            OrganizationId: org.id,
            right: 0
        });

        return res.send(JSON.stringify({result: true}));
    });
}