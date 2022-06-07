const { Sequelize, DataTypes } = require('sequelize');

/**
 * 
 * @param {import('../core')} core 
 * @returns {import('sequelize').ModelCtor<Model>}
 */
function DefineUserProject(core) {
    return core.GetSequelize().define('UserProject', {
        right: DataTypes.INTEGER() // 0 - owner, 1 - participant
    });
}

module.exports = DefineUserProject;