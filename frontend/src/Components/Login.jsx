import React, { useState, useEffect } from 'react';
import iTalk_Logo from "../Assets/iTalk_Logo.png";
import CryptoJs from "crypto-js";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import Axios from "axios";
import Toast from "toastr";
import ScreenDimensions from "../Others/useScreenDimensions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLanguage as Language} from '@fortawesome/free-solid-svg-icons';

export default function Login({ ResetSignUpTransition }){
    const [LoginEmail, setLoginEmail] = useState("");
    const [LoginPassword, setLoginPassword] = useState("");
    const { ScreenWidth, ScreenHeight } = ScreenDimensions();

    const { t, i18n } = useTranslation("Login");

    useEffect(() => {
        ResetSignUpTransition(true);

        // eslint-disable-next-line
    }, []);

    const LoginVariants = {
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

    const LoginTransition = {
        duration: 0.5
    };

    const ChangeLanguage = (Lang) => {
        i18n.changeLanguage(Lang);
        localStorage.setItem("Lang", Lang);
    }

    const SignIn = (e) => {
        e.preventDefault();
        
        if(LoginEmail === "" || LoginPassword === ""){
            Toast.warning(t("MissingLoginDataMessage"), t("MissingLoginDataTitle"), { timeOut: 2500, showDuration: true, closeButton: true })
        }
        else{
            Axios.get("http://localhost:3001/api/Users", {
                params: {
                    "Email": LoginEmail,
                    "Password": CryptoJs.SHA256(LoginPassword).toString()
                }
            }).then((Data) => {
                if(Data.data === "Invalid"){
                    Toast.warning(t("InvalidLoginMessage"), t("InvalidLoginTitle"), { timeOut: 2500, showDuration: true, closeButton: true })
                }
                else if(Data.data.startsWith("Error")){
                    Toast.error(t("ErrorLoginMessage"), t("ErrorLoginTitle"), { timeOut: 2500, showDuration: true, closeButton: true })
                }
                else{
                    localStorage.setItem("User", Data.data);
                    window.location.reload();
                }
            }).catch(() => {
                Toast.error(t("ErrorLoginMessage"), t("ErrorLoginTitle"), { timeOut: 2500, showDuration: true, closeButton: true })
            })
        }
    }

    return(
        <motion.div className="container-fluid Login" initial="initial" animate="animate" exit="exit" variants={ LoginVariants } transition={ LoginTransition }>
            <div className="row">
                <section className={`col-4 LoginAside vh-100 p-0 ${ScreenWidth < 990 ? "d-none": ""}`}>
                    <div className="p-4">
                        <h3 className="text-center mt-3">{ t("AsideDescription") }</h3>
                        <h5 className="text-center mt-3">{ t("AsideSubDescription") }</h5>
                    </div>
                </section>

                <section className={`LoginForm vh-100 ${ScreenWidth < 990 ? "col-12" : "col-8"}`}>
                    <div className="mt-4">
                        <div className={`dropdown ${ScreenWidth < 990 ? "me-4" : ""}`}>
                            <button className="btn btn-primary dropdown-toggle d-block ms-auto fs-6" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <FontAwesomeIcon className="me-2" icon={Language} />
                                <span>{ t("Language") }</span>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><button className="dropdown-item" onClick={() => ChangeLanguage("en")}>English</button></li>
                                <li><button className="dropdown-item" onClick={() => ChangeLanguage("es")}>Español</button></li>
                                <li><button className="dropdown-item" onClick={() => ChangeLanguage("fr")}>Français</button></li>
                            </ul>
                        </div>
                    </div>

                    <div className={`container ms-auto me-auto ${ScreenWidth < 990 ? "": "w-50"} ${ScreenHeight < 700 ? "" : "mt-5"}`}>
                        <div className="row position-relative">
                            <div className="col-12">
                                <figure>
                                    <img className="d-block m-auto" src={iTalk_Logo} alt="iTalk Logo" />
                                </figure>
                            </div>
                            
                            <div className="col-12">
                                <h2 className={`text-center ${ScreenHeight < 700 ? "" : "mt-2"}`}>{t("TitleLogin")}</h2>
                            </div>
                            
                            <div className="col-12">
                                <h6 className="fw-0 mt-3 text-center">
                                    { t("DescriptionLogin") } <Link className="text-decoration-none" to="/SignUp">{ t("SubDescriptionLogin") }</Link>
                                </h6>
                            </div>

                            <form className={`col-12 mt-4 ms-auto me-auto ${ScreenWidth < 1420 ? "w-100": "w-75"} ${ScreenWidth < 990 ? "p-0": ""}`} onSubmit={SignIn}>
                                <input type="email" id="LoginEmail" className="form-control form-control-lg" placeholder={ t("EmailPlaceholder") } onInput={ (e) => setLoginEmail(e.target.value) }/>
                                <input type="password" id="LoginPassword" className="form-control form-control-lg mt-2" placeholder={ t("PasswordPlaceholder") } onInput={ (e) => setLoginPassword(e.target.value) }/>
                                <input type="submit" className="btn btn-primary w-100 mt-3 form-control-lg fw-bold fs-5" value={ t("Login") }/>
                                <Link className={`btn btn-link text-end d-block text-decoration-none mt-1 ms-auto ${ScreenWidth < 990 ? "" : "w-100"}`} to="/Forgot">{ t("ForgotPassword") }</Link>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </motion.div>
    );
}