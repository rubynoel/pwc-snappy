import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import combineReducers from "./reducers/RootReducer";
import Amplify from "aws-amplify";
import { Authenticator, SignIn, Greetings } from "aws-amplify-react";
import config from "./aws-exports";
Amplify.configure(config);
const store = createStore(combineReducers, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Authenticator hideDefault={true} amplifyConfig={config}>
        <Greetings />
        <SignIn />
        <App />
      </Authenticator>
    </div>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
