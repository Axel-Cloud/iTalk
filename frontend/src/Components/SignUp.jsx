import React from 'react';
import iTalk_Logo from "../Assets/iTalk_Logo.png";
import Axios from "axios";
import CryptoJs from "crypto-js";
import Toast from "toastr";
import ScreenDimensions from "../Others/useScreenDimensions";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SignUp({ InitialTransition }){
    let FormSubmited = false;
    let FirstName = "";
    let LastName = "";
    let Email = "";
    let Gender = "";
    let Password = "";
    let ConfirmPassword = "";

    const FirstNameRef = React.createRef();
    const LastNameRef = React.createRef();
    const EmailRef = React.createRef();
    const GenderMaleRef = React.createRef();
    const GenderFemaleRef = React.createRef();
    const GenderCustomRef = React.createRef();
    const PasswordRef = React.createRef();
    const ConfirmPasswordRef = React.createRef();
    const SignUpButton = React.createRef();
    const LoginButton = React.createRef();

    const { ScreenWidth } = ScreenDimensions();
    const { t } = useTranslation("SignUp");

    const SignUpVariants = {
        initial: {
            x: InitialTransition
        },
        animate: {
            x: 0
        },
        exit: {
            x: "100vw"
        }
    }

    const SignUpTransition = {
        duration: 1.5
    }
    
    const setFields = (Field, Value) => {
        if(Field === "FirstName"){
            FirstName = Value;
        }
        else if(Field === "LastName"){
            LastName = Value;
        }
        else if(Field === "Email"){
            Email = Value;
        }
        else if(Field === "Gender"){
            Gender = Value;
        }
        else if(Field === "Password"){
            Password = Value;
        }
        else if(Field === "ConfirmPassword"){
            ConfirmPassword = Value;
        }

        ValidateForm();
    };

    const CreateUser = (e) => {
        e.preventDefault();

        FormSubmited = true;
        ValidateForm();

        FirstNameRef.current.disabled = true;
        LastNameRef.current.disabled = true;
        EmailRef.current.disabled = true;
        GenderMaleRef.current.disabled = true;
        GenderFemaleRef.current.disabled = true;
        GenderCustomRef.current.disabled = true;
        PasswordRef.current.disabled = true;
        ConfirmPasswordRef.current.disabled = true;
        SignUpButton.current.disabled = true;

        if(FirstNameRef.current.classList.contains("is-valid") && LastNameRef.current.classList.contains("is-valid") && EmailRef.current.classList.contains("is-valid") && (GenderMaleRef.current.classList.contains("is-valid") || GenderFemaleRef.current.classList.contains("is-valid") || GenderCustomRef.current.classList.contains("is-valid")) && PasswordRef.current.classList.contains("is-valid") && ConfirmPasswordRef.current.classList.contains("is-valid")){
            Axios.post("http://localhost:3001/api/Users", {
                "Name": FirstName,
                "Lastname": LastName,
                "Email": Email,
                "Password": CryptoJs.SHA256(Password).toString(),
                "Gender": Gender
            }).then((Data) => {
                if(Data.data === "Created"){
                    Toast.success(t("CreateAccountSuccessDescription"), t("CreateAccountSuccessTitle"), { timeOut: 2500, showDuration: true, closeButton: true });

                    if(LoginButton.current !== null){
                        LoginButton.current.click();
                    }
                }
                else if(Data.data === "Error: Duplicated Email"){
                    Toast.warning(t("DuplicatedEmailDescription"), t("DuplicatedEmailTitle"), { timeOut: 2500, showDuration: true, closeButton: true });

                    FirstNameRef.current.disabled = false;
                    LastNameRef.current.disabled = false;
                    EmailRef.current.disabled = false;
                    GenderMaleRef.current.disabled = false;
                    GenderFemaleRef.current.disabled = false;
                    GenderCustomRef.current.disabled = false;
                    PasswordRef.current.disabled = false;
                    ConfirmPasswordRef.current.disabled = false;
                    SignUpButton.current.disabled = false;
                }
                else{
                    Toast.warning(t("CreateAccountErrorDescription"), t("CreateAccountErrorTitle"), { timeOut: 2500, showDuration: true, closeButton: true });
                    
                    FirstNameRef.current.disabled = false;
                    LastNameRef.current.disabled = false;
                    EmailRef.current.disabled = false;
                    GenderMaleRef.current.disabled = false;
                    GenderFemaleRef.current.disabled = false;
                    GenderCustomRef.current.disabled = false;
                    PasswordRef.current.disabled = false;
                    ConfirmPasswordRef.current.disabled = false;
                    SignUpButton.current.disabled = false;
                }
            });
        }
    }

    const ValidateForm = () => {
        if(FormSubmited){
            //First Name Validation
            if(/^[A-Za-z ]+$/.test(FirstName) && FirstName.length >= 3){
                FirstNameRef.current.classList.remove("is-invalid");
                FirstNameRef.current.classList.add("is-valid");
            }
            else{
                FirstNameRef.current.classList.remove("is-valid");
                FirstNameRef.current.classList.add("is-invalid");
            }

            //Last Name Validation
            if(/^[A-Za-z ]+$/.test(LastName) && LastName.length >= 3){
                LastNameRef.current.classList.remove("is-invalid");
                LastNameRef.current.classList.add("is-valid");
            }
            else{
                LastNameRef.current.classList.remove("is-valid");
                LastNameRef.current.classList.add("is-invalid");
            }

            //Email Validation
            //Regex for email
            if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(Email)){
                EmailRef.current.classList.remove("is-invalid");
                EmailRef.current.classList.add("is-valid");
            }
            else{
                EmailRef.current.classList.remove("is-valid");
                EmailRef.current.classList.add("is-invalid");
            }

            //Gender Validation
            if(Gender !== ""){
                GenderMaleRef.current.classList.remove("is-invalid");
                GenderFemaleRef.current.classList.remove("is-invalid");
                GenderCustomRef.current.classList.remove("is-invalid");

                if(Gender === "Male"){
                    GenderFemaleRef.current.classList.remove("is-valid");
                    GenderCustomRef.current.classList.remove("is-valid");
                    GenderMaleRef.current.classList.add("is-valid");
                }
                else if(Gender === "Female"){
                    GenderMaleRef.current.classList.remove("is-valid");
                    GenderCustomRef.current.classList.remove("is-valid");
                    GenderFemaleRef.current.classList.add("is-valid");
                }
                else if(Gender === "Custom"){
                    GenderMaleRef.current.classList.remove("is-valid");
                    GenderFemaleRef.current.classList.remove("is-valid");
                    GenderCustomRef.current.classList.add("is-valid");
                }
            }
            else{
                GenderMaleRef.current.classList.remove("is-valid");
                GenderFemaleRef.current.classList.remove("is-valid");
                GenderCustomRef.current.classList.remove("is-valid");

                GenderMaleRef.current.classList.add("is-invalid");
                GenderFemaleRef.current.classList.add("is-invalid");
                GenderCustomRef.current.classList.add("is-invalid");
            }

            //Password Validation
            if(Password.length >= 6){
                PasswordRef.current.classList.remove("is-invalid");
                PasswordRef.current.classList.add("is-valid");
            }
            else{
                PasswordRef.current.classList.remove("is-valid");
                PasswordRef.current.classList.add("is-invalid");
            }

            //Confirm Password Validation
            if(ConfirmPassword === Password && ConfirmPassword.length >= 6){
                ConfirmPasswordRef.current.classList.remove("is-invalid");
                ConfirmPasswordRef.current.classList.add("is-valid");
            }
            else{
                ConfirmPasswordRef.current.classList.remove("is-valid");
                ConfirmPasswordRef.current.classList.add("is-invalid");
            }
        }
    }

    return(
        <motion.div className="SignUp" initial="initial" animate="animate" exit="exit" variants={SignUpVariants} transition={SignUpTransition}>
            <section className="container-fluid">
                <div className="row">
                    <div className={`d-block SignUpMain ${ScreenWidth < 1240 ? "col-12":"col-8"}`}>
                        <figure>
                            <img className="d-block m-auto" src={iTalk_Logo} alt="iTalk Logo" />
                        </figure>

                        <h1 className="text-center">{ t("SignUpTitle") }</h1>
                        <h5 className="text-center mb-5">{ t("SignUpDescription") } <Link className="text-decoration-none" ref={LoginButton} to="/">{ t("SignUpSubdescription") }</Link></h5>

                        <form onSubmit={CreateUser}>
                            <div className={`row ${ScreenWidth < 1240 ? "w-75 m-0 ms-auto me-auto" : ""}`} >
                                <div className={`p-0 pe-1 ${ScreenWidth < 890 ? "col-12":"col-6"}`}>
                                    <label htmlFor="SignUpFirstName" className="form-label fw-bold">{ t("FirstNameLabel") }</label>
                                    <input type="text" id="SignUpFirstName" className="form-control" ref={FirstNameRef} placeholder="Stephanie" onInput={ (e) => setFields("FirstName", e.target.value) }/>
                                </div>

                                <div className={`p-0 pe-1 ${ScreenWidth < 890 ? "col-12":"col-6"}`}>
                                    <label htmlFor="SignUpLastName" className="form-label fw-bold">{ t("LastNameLabel") }</label>
                                    <input type="text" id="SignUpLastName" className="form-control" ref={LastNameRef} placeholder="Jhonson" onInput={ (e) => setFields("LastName", e.target.value) }/>
                                </div>

                                <div className={`p-0 pe-1 mt-3 ${ScreenWidth < 890 ? "col-12":"col-6"}`}>
                                    <label htmlFor="SignUpEmail" className="form-label fw-bold">{ t("EmailLabel") }</label>
                                    <input type="email" id="SignUpEmail" className="form-control" ref={EmailRef} placeholder={ t("EmailPlaceholder") } onInput={ (e) => setFields("Email", e.target.value) }/>
                                </div>

                                <div className={`p-0 pe-1 mt-3 ${ScreenWidth < 890 ? "col-12":"col-6"}`}>
                                    <label className="fw-bold">{ t("GenderLabel") }</label>

                                    <div className="d-flex justify-content-between mt-3">
                                        <div className="form-check">
                                            <input type="radio" id="GenderMale" className="form-check-input" ref={GenderMaleRef} name="RadioGender" value="Male" onClick={ (e) => setFields("Gender", e.target.value) }/>
                                            <label className="form-check-label" htmlFor="GenderMale">
                                                { t("GenderMale") }
                                            </label>
                                        </div>
                                        
                                        <div className="form-check">
                                            <input type="radio" id="GenderFemale" className="form-check-input" ref={GenderFemaleRef} name="RadioGender" value="Female" onClick={ (e) => setFields("Gender", e.target.value) }/>
                                            <label className="form-check-label" htmlFor="GenderFemale">
                                                { t("GenderFemale") }
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input type="radio" id="GenderCustom" className="form-check-input" ref={GenderCustomRef} name="RadioGender" value="Custom" onClick={ (e) => setFields("Gender", e.target.value) }/>
                                            <label className="form-check-label" htmlFor="GenderCustom">
                                                { t("GenderCustom") }
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-0 pe-1 mt-3 ${ScreenWidth < 890 ? "col-12":"col-6"}`}>
                                    <label htmlFor="SignUpPassword" className="form-label fw-bold">{ t("Password") }</label>
                                    <input type="password" id="SignUpPassword" className="form-control" ref={PasswordRef} placeholder={ t("Password") } onInput={ (e) => setFields("Password", e.target.value) }/>
                                </div>

                                <div className={`p-0 pe-1 mt-3 ${ScreenWidth < 890 ? "col-12":"col-6"}`}>
                                    <label htmlFor="SignUpConfirmPassword" className="form-label fw-bold">{ t("ConfirmPassword") }</label>
                                    <input type="password" id="SignUpConfirmPassword" className="form-control" ref={ConfirmPasswordRef} placeholder={ t("ConfirmPassword") } onInput={ (e) => setFields("ConfirmPassword", e.target.value) }/>
                                </div>

                                <p className="col-12 mt-2 text-muted p-0">● { t("PasswordValidation") }</p>

                                <input type="submit" className={`col-12 btn btn-primary m-auto ${ScreenWidth < 990 ? "mb-3":""}`} ref={SignUpButton} value={ t("CreateAccount") } onClick={CreateUser}/>
                            </div>
                        </form>
                    </div>

                    <div className={`SignUpAside ${ScreenWidth < 890 ? "d-none":"col-4"}`}>

                    </div>
                </div>
            </section>
        </motion.div>
    );
}