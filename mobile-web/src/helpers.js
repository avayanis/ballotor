import * as OktaSignIn from "@okta/okta-signin-widget";

import config from "./.config";

const kIdToken = "id_token";
const kAccessToken = "access_token";

export async function checkAuthentication() {
  console.log("heeeeere");
  await parseTokensFromUrlIfNecessary();
  getTokensFromLocalStorage();
  const userinfo = await this.props.auth.getUser();
  console.log("userinfo", userinfo);

  const authenticated = await this.props.auth.isAuthenticated();
  console.log("authenticated", authenticated);

  if (authenticated !== this.state.authenticated) {
    if (authenticated && !this.state.userinfo) {
      const userinfo = await this.props.auth.getUser();
      this.setState({ authenticated, userinfo });
    } else {
      this.setState({ authenticated });
    }
  }
}

async function parseTokensFromUrlIfNecessary() {
  return new Promise(resolve => {
    let signIn = getSignIn();
    if (!signIn || !signIn.token || !signIn.token.hasTokensInUrl()) {
      resolve(false);
    }

    signIn.token.parseTokensFromUrl(
      async function success(res) {
        //console.log("debug", res[0], res[1]);
        const idToken = res[0];
        const accessToken = res[1];
        signIn.tokenManager.add(kIdToken, idToken);
        signIn.tokenManager.add(kAccessToken, accessToken);
        localStorage.setItem(
          "okta-token-storage",
          JSON.stringify({ idToken: idToken, accessToken: accessToken })
        );
        setObjectInLocalStorage(kIdToken, idToken);
        setObjectInLocalStorage(kAccessToken, accessToken);
        resolve(true);
      },
      async function error(err) {
        // We're okay with there being an error
        resolve(false);
      }
    );
  });
}

function getTokensFromLocalStorage() {
  console.log("and here");
  const idToken = getObjectFromLocalStorage(kIdToken);
  console.log("but not here");
  console.log("idToken", idToken);
  if (idToken) {
    signIn.tokenManager.add(kIdToken, idToken);
    console.log("~~~~~");
  }

  const accessToken = getObjectFromLocalStorage(kAccessToken);
  console.log("accessToken", accessToken);
  if (accessToken) {
    console.log("accessToken", accessToken);
    signIn.tokenManager.add(kAccessToken, accessToken);
  }
  signIn.tokenManager.refresh();
}

function getObjectFromLocalStorage(key) {
  const json = localStorage.getItem(key);
  try {
    return JSON.parse(json);
  } catch (err) {}
  return null;
}

function setObjectInLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let signIn = null;
export function getSignIn() {
  if (signIn === null) {
    signIn = new OktaSignIn({
      baseUrl: config.oidc.issuer.split("/oauth2")[0],
      clientId: config.oidc.clientId,
      redirectUri: config.oidc.redirectUri,
      logo: "/react.svg",
      i18n: {
        en: {
          "primaryauth.title": "Sign in to React & Company"
        }
      },
      authParams: {
        responseType: ["id_token", "token"],
        issuer: config.oidc.issuer,
        display: "page",
        scopes: config.oidc.scope.split(" ")
      }
    });
  }
  return signIn;
}
