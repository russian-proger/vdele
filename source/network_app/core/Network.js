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
  this.getUser = (user_id) => this.requestAPI('get_user', { user_id });
  
  this.createOrganization = (name, privacy) => this.requestAPI('new_organization', { name, privacy });
  this.createUserProject = (name, privacy) => this.requestAPI('new_user_project', { name, privacy });

  this.getOrganizations = (user_id) => this.requestAPI('get_user_organizations', {user_id});
  this.getUserProjects = (user_id) => this.requestAPI('get_user_projects', {user_id});
}