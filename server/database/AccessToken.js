const { Sequelize, DataTypes } = require('sequelize');

/**
 * 
 * @param {import('../core')} core 
 * @returns {import('sequelize').ModelCtor<Model<any,any>>}
 */
function AccessToken(core) {
    return core.GetSequelize().define('AccessToken', {
        token: DataTypes.STRING(255),
        endAt: DataTypes.DATE()
    });
}

module.exports = AccessToken;