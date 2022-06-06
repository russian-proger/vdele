const Express = require('express');
const utils = require('../utils');

/**
 * 
 * @param {import('../core')} core 
 */
function Main(core) {
    const app = core.GetApp();
    
    const network_app_handle = (req, res) => {
        if (req.is_auth) {
            return res.render('netapp', {user: JSON.stringify({...req.user_info, password: undefined }) });
        } else {
            return res.redirect('/');
        }
    }

    app.use('/profile/:user_id', network_app_handle);
    app.use('/new_organization', network_app_handle);
    app.use('/new_organization_project', network_app_handle);
    app.use('/new_project', network_app_handle);
    app.use('/organization/:org_id', network_app_handle);
}

module.exports = Main;