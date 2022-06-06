const Express = require('express');
const utils = require('../utils');

/**
 * 
 * @param {import('../core')} core 
 */
function Main(core) {
    const app = core.GetApp();
    const Token = core.GetModel('AccessToken');
    
    app.use('/', async (req, res, next) => {
        let uinfo = null;
        if (!!req.cookies['sign_token'] && !!req.cookies['user_id']) {
            uinfo = await Token.findOne({
                where: {
                    token: req.cookies['sign_token'],
                    userId: req.cookies['user_id']
                },
                include: core.GetModel('User')
            });
        }
        
        req.is_auth = !!uinfo;

        if (req.is_auth) {
            req.user_info = uinfo.dataValues.User.dataValues;
        } else {
            res.clearCookie('sign_token');
            res.clearCookie('user_id');
        }

        return next();
    });
}

module.exports = Main;