import { Core } from './Core';
import { Events } from './Constants';
import * as Utils from './Utils';

const HOST_NAME = location.hostname;
const PORT = location.port;
const PROTO_POSTFIX = (location.protocol === 'http:' ? '' : 's');

/**
 * @param {Core} self
 */
export default function Network(self) {

  this.requestAPI = (method, params) => {
    // const seed = Math.random().toString(36).slice(2);
    // const secret = sha256.hmac(API_KEY, seed);
    return fetch(`http${PROTO_POSTFIX}://${HOST_NAME}:${PORT}/api/${method}`, {
      method: 'POST',
      // body: JSON.stringify({ ...params, uid: UID, secret, seed }),
      body: JSON.stringify({ ...params }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch((reason) => console.log({
      method, params, reason
    })).then(res => res.json());
  }

  /**
   * @method
   * @param {int} user_id
   * @returns {Promise<import('../../../server/api_types').GetUserResponse>}
   */
  
  this.createOrganization = (name, privacy) => this.requestAPI('new_organization', { name, privacy });
  this.createOrganizationProject = (org_id, name, privacy) => this.requestAPI('new_organization_project', { org_id, name, privacy });
  this.createUserProject = (name, privacy) => this.requestAPI('new_user_project', { name, privacy });
  
  this.getTask = (task_id) => this.requestAPI('get_task', {task_id});
  this.getUser                        = (user_id) => this.requestAPI('get_user',                      {user_id});
  this.getUserOrganizations           = (user_id) => this.requestAPI('get_user_organizations',        {user_id});
  this.getUserProjects                = (user_id) => this.requestAPI('get_user_projects',             {user_id});
  this.getOrganization                = (org_id ) => this.requestAPI('get_organization',              {org_id });
  this.getOrganizationProjects        = (org_id ) => this.requestAPI('get_organization_projects',     {org_id });
  this.getOrganizationParticipants    = (org_id ) => this.requestAPI('get_organization_participants', {org_id });
  this.getProjectWorkspaces           = (proj_id) => this.requestAPI('get_project_workspaces',        {proj_id});
  this.getProjectTasks                = (proj_id) => this.requestAPI('get_project_tasks',             {proj_id});
  this.getProjectParticipants         = (proj_id) => this.requestAPI('get_project_participants',      {proj_id});
  
  this.createProjectWorkspace = (proj_id, name) => this.requestAPI('new_project_workspace', {proj_id, name});
  this.deleteProjectWorkspace = (ws_id        ) => this.requestAPI('remove_project_workspace', {ws_id        });
  
  this.addParticipantToProject = (nick, proj_id) => this.requestAPI('add_participant_to_project', {nick, proj_id});
  this.deleteParticipantFromProject = (user_id, proj_id) => this.requestAPI('remove_participant_from_project', {user_id, proj_id});

  this.deleteProject = (proj_id) => this.requestAPI('remove_project', {proj_id});
  this.deleteTask = (task_id) => this.requestAPI('remove_task', {task_id});
  this.updateTask = (task_id, task) => this.requestAPI('update_task', {task_id, task});
  this.updateUserProjectRight = (proj_id, user_id, right) => this.requestAPI('update_user_project_right', {proj_id, user_id, right});
  
  this.changeProjectName = (proj_id, name) => this.requestAPI('change_project_name', {proj_id, name});

  this.createTask = (ws_id, name, descr) => this.requestAPI('new_task', {ws_id, name, descr});

  /** @deprecated */
  this.getProject = (project_id) => this.requestAPI('get_project');
}