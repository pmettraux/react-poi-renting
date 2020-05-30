import createAuth0Client from '@auth0/auth0-spa-js';

const apiBaseUrl = 'https://grp12.backend.mapathon.ehealth.hevs.ch';

export class ApiService {
  constructor() {
    (async () => {
      await this.init();
    })();
  }

  async init() {
    const auth0 = await createAuth0Client({
      domain: 'YOUR_DOMAIN',
      client_id: 'YOUR_CLIENT_ID'
    });
  
    console.log('auth0', auth0);
    this.accessToken = await auth0.getTokenSilently();
    console.log('accessToken', this.accessToken);
  }

  async getPois() {
    const result = await fetch(`${apiBaseUrl}/poi`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      }
    });
    const data = await result.json();
    console.log(data);
  }
}