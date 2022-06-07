/**
 * @param {import('../core')} core 
 */
async function GetUserProjectRight(core, user_id, proj_id) {
    const user_project = await core.GetModel('UserProject').findOne({
        where: {
            UserId: user_id,
            ProjectId: proj_id
        }
    });
    if (user_project == null) {
        return 3;
    } else {
        return user_project.dataValues.right;
    }
}

function GetData(model) {
    if (model == null) {
        return model;
    } else {
        return model.dataValues;
    }
}



module.exports = ({
    GetUserProjectRight,
    GetData
});