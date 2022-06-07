const { Sequelize, DataTypes } = require('sequelize');

/**
 * 
 * @param {import('../core')} core 
 * @returns {import('sequelize').ModelCtor<Model>}
 */
function DefineUserOrganization(core) {
    return core.GetSequelize().define('UserOrganization', {
        right: DataTypes.INTEGER() // 0 - owner, 1 - manager, 2 - participant
    });
}

module.exports = DefineUserOrganization;