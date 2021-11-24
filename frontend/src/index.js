import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { Provider } from 'react-redux';
import Store from "./Store/Index";

/* Begin Translations */

//Login
import Login_en from "./Translations/en/Login.json";
import Login_es from "./Translations/es/Login.json";
import Login_fr from "./Translations/fr/Login.json";

//Sign Up
import SignUp_en from "./Translations/en/SignUp.json";
import SignUp_es from "./Translations/es/SignUp.json";
import SignUp_fr from "./Translations/fr/SignUp.json";

//Forgot Password
import ForgotPassword_en from "./Translations/en/ForgotPassword.json";
import ForgotPassword_es from "./Translations/es/ForgotPassword.json";
import ForgotPassword_fr from "./Translations/fr/ForgotPassword.json";

//Reset Password
import ResetPassword_en from "./Translations/en/ResetPassword.json";
import ResetPassword_es from "./Translations/es/ResetPassword.json";
import ResetPassword_fr from "./Translations/fr/ResetPassword.json";

/* End Translations */

i18next.init({
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    en:{
      Login: Login_en,
      SignUp: SignUp_en,
      Forgot: ForgotPassword_en,
      Reset: ResetPassword_en
    },
    es: {
      Login: Login_es,
      SignUp: SignUp_es,
      Forgot: ForgotPassword_es,
      Reset: ResetPassword_es
    },
    fr: {
      Login: Login_fr,
      SignUp: SignUp_fr,
      Forgot: ForgotPassword_fr,
      Reset: ResetPassword_fr
    }
  }
});

ReactDOM.render(
  <React.StrictMode>
      <Provider store={Store}>
        <I18nextProvider i18n={ i18next }>
          <App />
        </I18nextProvider>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();