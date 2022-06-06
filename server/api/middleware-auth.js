const Express = require('express');

/**
 * @param {import('../core')} core
 * @param {Express.Router} router
 */
module.exports = (core, router) => {
    router.use('/', (req, res, next) => {
        console.log(req.user_info);
        if (!req.is_auth) {
            res.sendStatus(401);
            return res.end();
        }
        next();
    });
}