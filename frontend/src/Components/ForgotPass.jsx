import React from 'react';
import iTalk_Logo from "../Assets/iTalk_Logo.png";
import Axios from "axios";
import Toast from "toastr";
import { useTranslation } from 'react-i18next';
import ScreenDimensions from "../Others/useScreenDimensions";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/* Redux */
import { useSelector } from "react-redux";

export default function ForgotPass(){
    const { t } = useTranslation("Forgot");
    const EmailRef = React.createRef();
    const ForgotSubmit = React.createRef();
    const ReturnRef = React.createRef();
    const { ScreenWidth } = ScreenDimensions();

    const ApiURL = useSelector(state => state.ApiURL.URL);

    let FormSubmited = false; 
    let Email = "";

    const ForgotPassVariants = {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        }
    };

    const ForgotPassTransition = {
        duration: 0.5
    };

    const EmailSetter = (Value) => {
        Email = Value;

        ValidateEmail();
    };

    const ValidateEmail = () => {
        if(FormSubmited === true){
            //Regex for email
            if(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(Email)){
                EmailRef.current.classList.remove("is-invalid");
                EmailRef.current.classList.add("is-valid");
            }
            else{
                EmailRef.current.classList.remove("is-valid");
                EmailRef.current.classList.add("is-invalid");
            }
        }
    }

    const SendRecoverEmail = (e) => {
        e.preventDefault();

        FormSubmited = true;
        ValidateEmail();

        EmailRef.current.disabled = true;
        ForgotSubmit.current.disabled = true;

        if(EmailRef.current.classList.contains("is-valid")){
            Axios.post(`${ApiURL}/api/Users/Forgot`, { "Email": Email, "Language": localStorage.getItem("Lang")}).then((Data) => {
                if(Data.data === "Email Sent"){
                    Toast.success(t("EmailSentSuccess"), "", { timeOut: 5000, showDuration: true, closeButton: true });
                    
                    if(ReturnRef.current !== null){
                        ReturnRef.current.click();
                    }
                }
                else{
                    Toast.error(t("EmailSentErrorDescription"), t("EmailSentErrorTitle"), { timeOut: 5000, showDuration: true, closeButton: true });
                    
                    EmailRef.current.disabled = false;
                    ForgotSubmit.current.disabled = false;
                }
            });
        }
        else{
            EmailRef.current.disabled = false;
            ForgotSubmit.current.disabled = false;
        }
    }

    return(
        <motion.div className="ForgotPass" initial="initial" animate="animate" exit="exit" variants={ ForgotPassVariants } transition={ ForgotPassTransition }>
            <section className={`d-block ms-auto me-auto ${ScreenWidth < 990 ? "w-100":""}`}>
                <figure>
                    <img className="d-block m-auto" src={iTalk_Logo} alt="iTalk Logo" />
                </figure>

                <h3 className={`text-center ${ScreenWidth < 990 ? "mt-5":""}`}>{ t("ForgotTitle") }</h3>
                <h5 className="text-center">{ t("ForgotDescription") }</h5>
                
                <form className="mt-4" onSubmit={ SendRecoverEmail } noValidate>
                    <input type="email" id="EmailForgot" className="w-75 form-control ms-auto me-auto text-center" ref={EmailRef} name="EmailForgot" placeholder={ t("EmailPlaceholder") } onInput={ (E) => EmailSetter(E.target.value) }/>
                    <input type="submit" className="d-block w-75 btn btn-primary mt-3 ms-auto me-auto" ref={ForgotSubmit} value={ t("RecoverAccountButton") } />
                </form>

                <Link className="d-block w-75 m-auto mt-3 text-end text-decoration-none" ref={ReturnRef} to="/">{ t("RememberCredentials") }</Link>
            </section>
        </motion.div>
    );
}