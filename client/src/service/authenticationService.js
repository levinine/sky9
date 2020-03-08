import Amplify, { Auth, Hub } from 'aws-amplify';
import { createBrowserHistory } from 'history';

import config from '../config';

const history = createBrowserHistory();

const attachAuthListeners = () => {
  Hub.listen('auth', ({ payload: { event, data } }) => {
    // console.log('Amplify Hub auth event', event, data);
    if (event === 'parsingCallbackUrl') {
      if (~data.url.indexOf('error_description')) {
        console.log('Callback URL contains error. Go to /forbidden');
        history.push('forbidden');
      }
    }
  });
}
const configureAmplify = () => {
  try {
    Amplify.configure({
      Auth: {
        region: config.cognitoRegion,
        userPoolId: config.cognitoUserPoolId,
        userPoolWebClientId: config.cognitoClientId,
        oauth: {
          domain: config.cognitoUrl,
          scope: ['openid', 'email'],
          redirectSignIn: config.baseUrl,
          redirectSignOut: config.cognitoSignOutUrl,
          responseType: 'token'
        }
      },
      API: {
        endpoints: [{
          name: 'accounts',
          endpoint: config.apiUrl,
          custom_header: async () => {
            let user = await getUser();
            if (user) {
              return { Authorization : user.signInUserSession.idToken.jwtToken };
            } else {
              history.push('login');
            }
          }
        }]
      }
    });
  } catch (err) {
    console.log('Couldn\'t configure Amplify', err);
  }
}

const login = () => {
  return Auth.federatedSignIn({ provider: config.cognitoAuthProvider }).then(res => {
    console.log('Login success');
    return res;
  }).catch(err => {
    console.log('Login fail', err);
    throw err;
  });
}

const logout = async () => {
  Auth.signOut();
}

const getUser = async () => {
  return Auth.currentAuthenticatedUser({ bypassCache: false })
    .then(user => {
      // console.log('curent auth user', user);
      return user;
    })
    .catch(async () => {
      return null;
    });
}

const init = () => {
  attachAuthListeners();
  configureAmplify();
}

export {
  init,
  login,
  logout,
  getUser
}