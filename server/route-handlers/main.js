const Express = require('express');
const utils = require('../utils');

/**
 * 
 * @param {import('../core')} core 
 */
function Main(core) {
    const app = core.GetApp();
    
    app.get('/', (req, res) => {
        if (req.is_auth) {
            return res.render('netapp', {user: JSON.stringify({...req.user_info, token: undefined, password: undefined }) });
        }
        utils.express.SendView(res, 'welcome.html');
    });
}

module.exports = Main;