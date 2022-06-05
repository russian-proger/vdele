const Express = require('express');
/**
 * 
 * @param {import('../core')} core 
 */
module.exports = (core) => {
    const api_router = Express.Router();
    
    core.GetApp().use('/api', api_router);
}

