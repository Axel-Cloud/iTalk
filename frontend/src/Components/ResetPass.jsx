import React, { useState, useEffect } from 'react'
import iTalk_Logo from "../Assets/iTalk_Logo.png";
import Axios from "axios";
import CryptoJs from "crypto-js";
import Toast from "toastr";
import ScreenDimensions from "../Others/useScreenDimensions";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from "react-i18next";
import { useParams, useLocation } from 'react-router';

export default function ResetPass(){
    const [Visible, setVisible] = useState(false)

    const { Token } = useParams();
    const Query = new URLSearchParams(useLocation().search);
    const {t} = useTranslation("Reset");

    const PasswordRef = React.createRef();
    const ConfirmPasswordRef = React.createRef();
    const UpdatePassButton = React.createRef();
    const ReturnButtonRef = React.createRef();
    const { ScreenWidth } = ScreenDimensions();

    let FormSubmited = false;
    let Password = "";
    let ConfirmPassword = "";

    useEffect(() => {
        if(Query.get("ccl") === "s"){
            Axios.put("http://localhost:3001/api/Users/Reset/Cancel", { "id": Token }).then((Data) => {
                document.getElementById("ReturnButtonccl").click();
            });
        }
        else{
            setVisible(true);
        }

        // eslint-disable-next-line
    }, []);

    const ResetPassVariants = {
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

    const ResetPassTransition = {
        duration: 1.5
    };

    const ResetPassword = (e) => {
        e.preventDefault();

        PasswordRef.current.disabled = true;
        ConfirmPasswordRef.current.disabled = true;
        UpdatePassButton.current.disabled = true;

        FormSubmited = true;
        
        ValidateForm();

        if(PasswordRef.current.classList.contains("is-valid") && ConfirmPasswordRef.current.classList.contains("is-valid")){
            Axios.put("http://localhost:3001/api/Users/Reset", { Token, "Password": CryptoJs.SHA256(Password).toString() }).then((Data) => {
                if(Data.data === "Password Updated"){
                    Toast.success(t("UpdatedPasswordDescription"), t("UpdatedPasswordTitle"), { timeOut: 5000, showDuration: true, closeButton: true });

                    if(ReturnButtonRef.current !== null){
                        ReturnButtonRef.current.click();
                    }
                }
                else if(Data.data === "User not found" || Data.data === "Invalid Token"){
                    Toast.warning(t("UserNotFound"), "", { timeOut: 5000, showDuration: true, closeButton: true });
                    
                    PasswordRef.current.disabled = false;
                    ConfirmPasswordRef.current.disabled = false;
                    UpdatePassButton.current.disabled = false;
                }
                else if(Data.data === "Expired Token"){
                    Toast.warning(t("InvalidToken"), "", { timeOut: 5000, showDuration: true, closeButton: true });

                    PasswordRef.current.disabled = false;
                    ConfirmPasswordRef.current.disabled = false;
                    UpdatePassButton.current.disabled = false;
                }
                else{
                    Toast.error(t("ErrorDescription"), t("ErrorTitle"), { timeOut: 5000 , showDuration: true, closeButton: true });

                    PasswordRef.current.disabled = false;
                    ConfirmPasswordRef.current.disabled = false;
                    UpdatePassButton.current.disabled = false;
                }
            });
        }
    }

    const SetFields = (Value, Field) => {
        if(Field === "Password"){
            Password = Value;
        }
        else if(Field === "ConfirmPassword"){
            ConfirmPassword = Value;
        }

        ValidateForm();
    }

    const ValidateForm = () => {
        if(FormSubmited){
            if(Password.length >= 6){
                PasswordRef.current.classList.remove("is-invalid");
                PasswordRef.current.classList.add("is-valid");
            }
            else{
                PasswordRef.current.classList.remove("is-valid");
                PasswordRef.current.classList.add("is-invalid");
            }
    
            if(ConfirmPassword === Password && ConfirmPassword.length >= 6){
                ConfirmPasswordRef.current.classList.remove("is-invalid");
                ConfirmPasswordRef.current.classList.add("is-valid");
            }
            else{
                ConfirmPasswordRef.current.classList.remove("is-valid");
                ConfirmPasswordRef.current.classList.add("is-invalid");
            }
        }
    };

    return(
        <>
            {
                Visible ? 
                <motion.div className="ForgotPass" initial="initial" animate="animate" exit="exit" variants={ ResetPassVariants } transition={ ResetPassTransition }>
                    <section className={`d-block ms-auto me-auto ${ScreenWidth < 990 ? "w-100":""}`}>
                        <figure>
                            <img className="d-block m-auto" src={iTalk_Logo} alt="iTalk Logo" />
                        </figure>

                        <h3 className={`text-center ${ScreenWidth < 990 ? "mt-5":""}`}> { t("Title") } </h3>
                        <h5 className="text-center"> { t("Description") } </h5>
                        
                        <form className="mt-4" onSubmit={ ResetPassword }>
                            <div className="row">
                                <input type="password" id="PasswordReset" className="w-75 form-control ms-auto me-auto text-center" ref={PasswordRef} name="PasswordReset" placeholder={ t("Password") } onInput={ (e) => SetFields(e.target.value, "Password") }/>
                                <input type="password" id="ConfirmPasswordReset" className="w-75 form-control mt-2 ms-auto me-auto text-center" ref={ConfirmPasswordRef} name="ConfirmPasswordReset" placeholder={ t("ConfirmPassword") } onInput={ (e) => SetFields(e.target.value, "ConfirmPassword") }/>
                                <input type="submit" className="d-block w-75 btn btn-primary mt-3 ms-auto me-auto" ref={UpdatePassButton} value={ t("UpdatePassword") } />
                            </div>
                        </form>

                        <Link className="d-block w-75 m-auto mt-3 text-end text-decoration-none" ref={ReturnButtonRef} to="/"> { t("RememberPassword") } </Link>
                    </section>
                </motion.div>
                :
                <Link id="ReturnButtonccl" className="opacity-0" to="/"></Link>
            }     
        </>   
    );
}