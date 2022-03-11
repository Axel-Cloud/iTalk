import React, { useEffect } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./Styles/bootstrap.css";
import "../node_modules/bootstrap/js/dist/dropdown";
import "../node_modules/toastr/build/toastr.css";

/* Components */
import ITalk from './Components/iTalk';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    if(localStorage.getItem("Lang") === null){
      localStorage.setItem("Lang", window.navigator.language.substr(0, 2));
    }

    i18n.changeLanguage(localStorage.getItem("Lang"));
    // eslint-disable-next-line
  }, [])

  return (
    <Router>
        <ITalk/>
    </Router>
  );
}

export default App;
