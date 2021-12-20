import { Core } from './Core';
import { Events } from './Constants';
import * as Utils from './Utils';

const IN_BROWSER = typeof location !== 'undefined' && location.hostname.length !== 0;
const HOST_NAME = IN_BROWSER ? location.hostname : '7-spirit-13.online';
const PORT = IN_BROWSER ? location.port : 443;
const PROTO_POSTFIX = IN_BROWSER && location.protocol === 'http:' ? '' : 's';

/**
 * @param {Core} self
 */
export default function Network(self) {
  /** @type {Socket} */
  this.ws = null;

  this.requestAPI = (params) => {
    // const seed = Math.random().toString(36).slice(2);
    // const secret = sha256.hmac(API_KEY, seed);
    return fetch(`http${PROTO_POSTFIX}://${HOST_NAME}:${PORT}/api`, {
      method: 'POST',
      // body: JSON.stringify({ ...params, uid: UID, secret, seed }),
      body: JSON.stringify({ ...params }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());
  }
  
}