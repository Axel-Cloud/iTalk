import React, { useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

/* Components */
import Login from "./Login";
import SignUp from "./SignUp";
import ForgotPass from "./ForgotPass";
import ResetPass from "./ResetPass";
import Messenger from "./Messenger/Messenger";

export default function ITalk() {
  const [SignUpInitialTransition, setSignUpInitialTransition] = useState("0");

  const Location = useLocation();

  const ResetSignUpTransition = (Next) => {
    setSignUpInitialTransition(Next ? "100vw" : "0");
  }

  return (
    <main className="iTalkMain">
      <AnimatePresence exitBeforeEnter>
        <Switch location={Location} key={Location.pathname}>
          <Route path="/" exact>
            {
              localStorage.getItem("User") === null ?
              <Login ResetSignUpTransition={ ResetSignUpTransition } />
              :
              <Messenger/>
            }
          </Route>

          <Route path="/SignUp" exact>
            <SignUp InitialTransition={ SignUpInitialTransition }/>
          </Route>

          <Route path="/Forgot" exact>
            <ForgotPass/>
          </Route>

          <Route path="/Reset/:Token" exact>
            <ResetPass/>
          </Route>
        </Switch>
      </AnimatePresence>
    </main>
  );
}
