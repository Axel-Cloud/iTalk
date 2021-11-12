import React, { useEffect } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import Toast from "toastr";
import "./Styles/bootstrap.css";
import "../node_modules/bootstrap/js/dist/dropdown";
import "../node_modules/toastr/build/toastr.css";

/* Components */
import ITalk from './Components/iTalk';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    Toast.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }

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
