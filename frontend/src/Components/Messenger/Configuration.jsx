import React, { useState } from 'react'
import { Modal } from "react-bootstrap";
import Toast from "toastr";
import Axios from 'axios';
import { useTranslation } from "react-i18next";

/* Redux */
import { useSelector, useDispatch } from "react-redux";
import { UpdateUserInfo } from "../../Store/UserInfo/action";

export default function Configuration() {
    /* States */
    const [ShowProfileImageModal, setShowProfileImageModal] = useState(false);
    const [ProfileImageTemp, setProfileImageTemp] = useState("");
    const [LoadingProfileImage, setLoadingProfileImage] = useState(false);
    
    const [Name, setName] = useState("");
    const [LastName, setLastName] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");

    /* Redux Variables */
    const FirstName = useSelector(state => state.UserInfo.Name);
    const Lastname = useSelector(state => state.UserInfo.Lastname);
    const UserProfileImage = useSelector(state => state.UserInfo.ProfileImage);

    const dispatch = useDispatch();
    const { t } = useTranslation("Messenger");
    const EditProfileImageBtn = React.createRef();

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

    /* const SaveProfileImage = () => {
        Axios.put("http://localhost:3001/api/Users/UpdatePI", { ID: localStorage.getItem("User"), ProfileImage: ProfileImageTemp.split(",")[1] }).then((Data) => {
            if(Data.data === "Updated"){
                dispatch(UpdateUserInfo({ Name, Lastname, ProfileImage: ProfileImageTemp.split(",")[1]}));
                ProfileImageModalClose();
            }
            else{
                Toast.error("Hubo un error al actualizar la imagen, intente nuevamente", "Error", { timeOut: 2500, showDuration: true, closeButton: true });
            }
        });
    } */

    const SaveProfileImage = () => {
        setShowProfileImageModal(false);
    };

    const LoadProfileImage = (Image) => {
        console.log(Image)
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

    return (
        <section>
            <form>
                <figure className="h-100 position-relative">
                    <img className="d-block m-auto rounded-circle ProfileImageConfigSize" src={`data:image/png;base64,${UserProfileImage}`} alt="" />
                    <button className='ProfileImageEditButton btn' ref={EditProfileImageBtn} onClick={(e) => ProfileImageModalShow(e)}>Editar</button>
                </figure>

                <div className='UpdateConfig'>
                    <div className='d-flex w-100'>
                        <div className="w-50 me-1 form-group">
                            <label className='d-block' htmlFor="ConfigNameInput">Nombre</label>
                            <input id="ConfigNameInput" type="text" className="form-control" placeholder="Nombre" onInput={(e) => setName(e.target.value)}/>
                        </div>

                        <div className="w-50 ms-1 form-group">
                            <label className='d-block' htmlFor="ConfigLastnameInput">Apellido</label>
                            <input id="ConfigLastnameInput" type="text" className="form-control" placeholder="Apellido" onInput={(e) => setLastName(e.target.value)}/>
                        </div>
                    </div>

                    <div className="form-group mt-3">
                        <label htmlFor="ConfigEmailInput">Correo Electrónico</label>
                        <input id="ConfigEmailInput" readOnly type="text" className="form-control"/>
                    </div>

                    <div className='d-flex w-100 mt-3'>
                        <div className="w-50 me-1 form-group">
                            <label className='d-block' htmlFor="ConfigPasswordInput">Contraseña</label>
                            <input id="ConfigPasswordInput" type="password" className="form-control" placeholder="Contraseña" onInput={(e) => setPassword(e.target.value)}/>
                        </div>

                        <div className="w-50 ms-1 form-group">
                            <label className='d-block' htmlFor="ConfigConfirmPasswordInput">Confirmar Contraseña</label>
                            <input id="ConfigConfirmPasswordInput" type="password" className="form-control" placeholder="Confirmar Contraseña" onInput={(e) => setConfirmPassword(e.target.value)}/>
                        </div>
                    </div>

                    <div className="d-grid gap-2 mt-4">
                        <button className='btn btn-primary e-block' type="submit" disabled={ProfileImageTemp.length === 0 && Name.length === 0 && LastName.length === 0 && Password.length === 0 && ConfirmPassword.length === 0}>Actualizar Datos</button>
                    </div>
                </div>
            </form>

            <Modal className='ProfileImageModal' show={ShowProfileImageModal} onHide={ProfileImageModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{t("ProfileImageModalTitle")}</Modal.Title>
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
                            <img className='d-block ms-auto me-auto rounded-circle' src={`data:image/png;base64,${UserProfileImage}`} alt="" />
                            :
                            <img className='d-block ms-auto me-auto rounded-circle' src={ProfileImageTemp} alt="" />
                        }
                    </figure>
                </Modal.Body>

                <Modal.Footer>
                    <button className='btn btn-secondary' onClick={ProfileImageModalClose}>Cancel</button>

                    <label htmlFor="ProfileImageFile" className='btn btn-primary'>Load Image</label>
                    <input id="ProfileImageFile" className='d-none' accept="image/png, image/gif, image/jpeg" disabled={LoadingProfileImage === true} type="file" onChange={(e) => LoadProfileImage(e.target.files[0])}/>

                    {
                        ProfileImageTemp !== "" &&
                        <button className='btn btn-primary' onClick={SaveProfileImage}>Save Changes</button>
                    }
                </Modal.Footer>
            </Modal>
        </section>
    )
}