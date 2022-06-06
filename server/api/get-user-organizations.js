const Express = require('express');
const utils = require('../utils');
/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.post('/get_user_organizations', async (req, res) => {

        if (!utils.checker.IsInteger(req.body.user_id))
            return res.sendStatus(400);

        const organizations = await core.GetModel('User').findOne({
            attributes: ['id'],
            where: {
                id: req.body.user_id,
            },
            include: [{
                model: core.GetModel('Organization'),
            }]
        }, );

        console.log(organizations.dataValues.Organizations.map(v => v.dataValues));
        
        return res.send(JSON.stringify({result: true, data: organizations.dataValues.Organizations.map(v => v.dataValues)}));
    });
}