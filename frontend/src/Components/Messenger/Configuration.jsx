import React, { useState, useEffect } from 'react'
import { Modal } from "react-bootstrap";
import Toast from "toastr";
import Axios from 'axios';
import ScreenDimensions from "../../Others/useScreenDimensions";
import CryptoJs from "crypto-js";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";
import { faLanguage as Language} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/* Redux */
import { useSelector, useDispatch } from "react-redux";
import { UpdateUserInfo } from "../../Store/UserInfo/action";
import { SelectedConversation } from '../../Store/SelectedConversation/action';
import { AsideStatus } from "../../Store/AsideMenuStatus/action";

export default function Configuration() {
    /* States */
    const [ShowProfileImageModal, setShowProfileImageModal] = useState(false);
    const [ProfileImageTemp, setProfileImageTemp] = useState("");
    const [LoadingProfileImage, setLoadingProfileImage] = useState(false);
    const [UpdatingInfo, setUpdatingInfo] = useState(false);

    const [FirstNameInput, setFirstNameInput] = useState("");
    const [LastnameInput, setLastnameInput] = useState("");
    const [PasswordInput, setPasswordInput] = useState("");
    const [ConfirmPasswordInput, setConfirmPasswordInput] = useState("");

    /* Redux Variables */
    const FirstNameRedux = useSelector(state => state.UserInfo.Name);
    const LastnameRedux = useSelector(state => state.UserInfo.Lastname);
    const EmailRedux = useSelector(state => state.UserInfo.Email);
    const UserProfileImageRedux = useSelector(state => state.UserInfo.ProfileImage);
    const ApiURL = useSelector(state => state.ApiURL.URL);

    const dispatch = useDispatch();
    const Socket = io(ApiURL);

    const { ScreenWidth } = ScreenDimensions();
    const { i18n, t } = useTranslation("Configuration");
    const EditProfileImageBtn = React.createRef();

    useEffect(() => {
        Socket.connect();

        return () => {
            Socket.disconnect();
        }
        
        // eslint-disable-next-line
    }, []);

    const ProfileImageModalShow = (e) => {
        e.preventDefault();
        EditProfileImageBtn.current.blur();
        setShowProfileImageModal(true);
    };

    const ProfileImageModalClose = () => {
        setShowProfileImageModal(false);
        setTimeout(() => {
            setProfileImageTemp("");
        }, 250);
    };

    const UpdateInfo = (e) => {
        e.preventDefault();
        setUpdatingInfo(true);
        
        let FirstNameAux = FirstNameInput.length > 0 ? FirstNameInput : FirstNameRedux;
        let LastnameAux = LastnameInput.length > 0 ? LastnameInput : LastnameRedux;
        let ProfileImageAux = ProfileImageTemp.length > 0 ? ProfileImageTemp.split(",")[1] : UserProfileImageRedux;

        if(PasswordInput === ConfirmPasswordInput){
            Axios.put(`${ApiURL}/api/Users/UpdateUserInfo`, {
                ID: localStorage.getItem("User"),
                Name: FirstNameAux,
                Lastname: LastnameAux,
                ProfileImage: ProfileImageAux,
                Password: PasswordInput.length > 0 ? CryptoJs.SHA256(PasswordInput).toString() : ""
            }).then((Data) => {
                if(Data.data === "Updated"){
                    Axios.get(`${ApiURL}/api/Users/Data`, {
                        params: {
                            ID: localStorage.getItem("User")
                        }
                    }).then((Data) => {
                        dispatch(UpdateUserInfo({Name: Data.data.Name, Lastname: Data.data.Lastname, Email: Data.data.Email, ProfileImage: Data.data.ProfileImage}));
                        Data.data.LastReadedConversation.isSelected = true;
                        dispatch(SelectedConversation(Data.data.LastReadedConversation));
                        dispatch(AsideStatus("Conversation"));
                        
                        setUpdatingInfo(false);
                        Toast.success("Se ha actualizado su información satisfactoriamente.", "Información Actualizada", { timeOut: 2500, showDuration: true, closeButton: true });
                    });
                }
                else{
                    Toast.warning("Ha ocurrido un error al intentar cambiar los datos de su usuario.", "Advertencia", { timeOut: 2500, showDuration: true, closeButton: true });
                }
            });
        }
        else{
            Toast.warning("Las contraseñas ingresadas no coinciden.", "Advertencia", { timeOut: 2500, showDuration: true, closeButton: true });
        }
    }

    const SaveProfileImage = () => {
        setShowProfileImageModal(false);
    };

    const LoadProfileImage = (Image) => {
        if(Image.type.includes("image") && (Image.size / 1000000) <= 0.512){
            setLoadingProfileImage(true);

            var ImageReader = new FileReader();
            ImageReader.readAsDataURL(Image);

            ImageReader.onload = () => {
                setProfileImageTemp(ImageReader.result)
                setLoadingProfileImage(false);
            };

            ImageReader.onerror = () => {
                setLoadingProfileImage(false);
                Toast.error("Hubo un error al intentar cargar la imagen, intente nuevamente", "Error", { timeOut: 2500, showDuration: true, closeButton: true });
            };
        }
        else if((Image.size / 1000000) > 0.512){
            Toast.warning("La imagen debe tener un peso máximo de 512kb", "Advertencia", { timeOut: 2500, showDuration: true, closeButton: true });
        }
        else{
            Toast.warning("El archivo debe ser una imagen.", "Advertencia", { timeOut: 2500, showDuration: true, closeButton: true });
        }
    }

    const ChangeLanguage = (e, Lang) => {
        e.preventDefault();
        i18n.changeLanguage(Lang);
        localStorage.setItem("Lang", Lang);
    }

    const Logout = (e) => {
        e.preventDefault();
        Disconnected();
        localStorage.removeItem("User");
        window.location.reload();
    }

    const Disconnected = () => {
        Socket.emit("UnsetUser", {UserID: localStorage.getItem("User")});    
    };

    return (
        <section>
            <form>
                <div className={`dropdown me-1 mb-3`}>
                    <button className="btn btn-primary dropdown-toggle d-block ms-auto fs-6" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <FontAwesomeIcon className="me-2" icon={Language} />
                        <span>{ t("Language") }</span>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><button className="dropdown-item" onClick={(e) => ChangeLanguage(e, "en")}>English</button></li>
                        <li><button className="dropdown-item" onClick={(e) => ChangeLanguage(e, "es")}>Español</button></li>
                        <li><button className="dropdown-item" onClick={(e) => ChangeLanguage(e, "fr")}>Français</button></li>
                    </ul>
                </div>

                <figure className="h-100 position-relative">
                    {
                        ProfileImageTemp.length > 0 ?
                        <img className="d-block m-auto rounded-circle ProfileImageConfigSize" src={`${ProfileImageTemp}`} alt="" />
                        :
                        <img className="d-block m-auto rounded-circle ProfileImageConfigSize" src={`data:image/png;base64,${UserProfileImageRedux}`} alt="" />
                    }
                    
                    
                    <button className='ProfileImageEditButton btn' ref={EditProfileImageBtn} onClick={(e) => ProfileImageModalShow(e)}>{ t("EditProfileImage") }</button>
                </figure>

                <div className='UpdateConfig'>
                    <div className='d-flex w-100'>
                        <div className="w-50 me-1 form-group">
                            <label className='d-block OneLineText' htmlFor="ConfigNameInput">{ t("FirstNameInput") }</label>
                            <input id="ConfigNameInput" type="text" className="form-control" placeholder={ t("FirstNameInput") } onInput={(e) => setFirstNameInput(e.target.value)}/>
                        </div>

                        <div className="w-50 ms-1 form-group">
                            <label className='d-block OneLineText' htmlFor="ConfigLastnameInput">{ t("LastnameInput") }</label>
                            <input id="ConfigLastnameInput" type="text" className="form-control" placeholder={ t("LastnameInput") } onInput={(e) => setLastnameInput(e.target.value)}/>
                        </div>
                    </div>

                    <div className="form-group mt-3">
                        <label className='OneLineText' htmlFor="ConfigEmailInput">{ t("Email") }</label>
                        <input id="ConfigEmailInput" readOnly type="text" className="form-control" value={EmailRedux}/>
                    </div>

                    <div className='d-flex w-100 mt-3'>
                        <div className="w-50 me-1 form-group">
                            <label className='d-block OneLineText' htmlFor="ConfigPasswordInput">{ t("Password") }</label>
                            <input id="ConfigPasswordInput" type="password" className="form-control" placeholder={ t("Password") } onInput={(e) => setPasswordInput(e.target.value)}/>
                        </div>

                        <div className="w-50 ms-1 form-group">
                            <label className='d-block OneLineText' htmlFor="ConfigConfirmPasswordInput">{ t("ConfirmPassword") }</label>
                            <input id="ConfigConfirmPasswordInput" type="password" className="form-control" placeholder={ t("ConfirmPassword") } onInput={(e) => setConfirmPasswordInput(e.target.value)}/>
                        </div>
                    </div>

                    <div className="d-grid gap-2 mt-4">
                        <button className='btn btn-primary e-block' type="submit" disabled={(ProfileImageTemp.length === 0 && FirstNameInput.length === 0 && LastnameInput.length === 0 && PasswordInput.length === 0 && ConfirmPasswordInput.length === 0) || UpdatingInfo} onClick={(e) => UpdateInfo(e)}>{ t("UpdateInformation") }</button>
                    </div>

                    {
                        ScreenWidth < 880 &&
                        <div className="d-grid gap-2 mt-4">
                            <button className='btn btn-secondary e-block' onClick={(e) => Logout(e)}>{ t("SignOut") }</button>
                        </div>
                    }
                </div>
            </form>

            <Modal className='ProfileImageModal' show={ShowProfileImageModal} onHide={ProfileImageModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{ t("ProfileImageModalTitle") }</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <figure>
                        {
                            LoadingProfileImage === true ?
                            <section>
                                <div className="spinner-grow" role="status">
                                    <span className="sr-only"></span>
                                </div>
                            </section>
                            :   
                            ProfileImageTemp === "" ?
                            <img className='d-block ms-auto me-auto rounded-circle' src={`data:image/png;base64,${UserProfileImageRedux}`} alt="" />
                            :
                            <img className='d-block ms-auto me-auto rounded-circle' src={ProfileImageTemp} alt="" />
                        }
                    </figure>
                </Modal.Body>

                <Modal.Footer>
                    <button className='btn btn-secondary' onClick={ProfileImageModalClose}>{ t("ModalCancel") }</button>

                    <label htmlFor="ProfileImageFile" className='btn btn-primary'>{ t("LoadImage") }</label>
                    <input id="ProfileImageFile" className='d-none' accept="image/png, image/gif, image/jpeg" disabled={LoadingProfileImage === true} type="file" onChange={(e) => LoadProfileImage(e.target.files[0])}/>

                    {
                        ProfileImageTemp !== "" &&
                        <button className='btn btn-primary' onClick={SaveProfileImage}>{ t("SaveChanges") }</button>
                    }
                </Modal.Footer>
            </Modal>
        </section>
    )
}