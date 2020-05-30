import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import auth_config from "./auth_config.js";
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from "./shared/react-auth0-spa";
import 'leaflet/dist/leaflet.css';
import { createBrowserHistory } from "history";

let history = createBrowserHistory();

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={auth_config.domain}
    client_id={auth_config.clientId}
    redirect_uri={window.location.origin}
    audience={auth_config.audience}
    onRedirectCallback={onRedirectCallback}
    useRefreshTokens={true}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
