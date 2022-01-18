import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import ScreenDimensions from "../../Others/useScreenDimensions";
import Axios from 'axios';
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Toast from "toastr";

/* Components */
import ConversationList from './ConversationList';
import Search from "./Search";
import Configuration from "./Configuration";

/* Icons */
import iTalkIcon from "../../Assets/iTalk_Icon.png";
import { ReactComponent as ChatIcon } from '../../Assets/icons/Chat.svg';
import { ReactComponent as ConfigIcon } from '../../Assets/icons/Config.svg';
import { ReactComponent as SignOutIcon } from '../../Assets/icons/SignOut.svg';

/* Redux */
import { SelectedConversation } from '../../Store/SelectedConversation/action';
import { UpdateUserInfo } from "../../Store/UserInfo/action";
import { UpdateConversations } from "../../Store/Conversations/action";
import { AsideStatus } from "../../Store/AsideMenuStatus/action";

export default function AsideMenu({ Socket }){
    //Search, conversation list, and configuration
    const [SearchData, setSearchData] = useState([]);
    const [ProfileImageTemp, setProfileImageTemp] = useState("");
    const [LoadingProfileImage, setLoadingProfileImage] = useState(false);
    const [ShowProfileImageModal, setShowProfileImageModal] = useState(false);

    const dispatch = useDispatch();
    const { t } = useTranslation("Messenger");
    const InputRef = React.createRef();

    const { ScreenWidth } = ScreenDimensions();
    const SectionType = useSelector(state => state.StatusAsideMenu.Status);
    const FirstName = useSelector(state => state.UserInfo.Name);
    const Lastname = useSelector(state => state.UserInfo.Lastname);
    const ProfileImage = useSelector(state => `${state.UserInfo.ProfileImage}`);
    const Conversations = useSelector(state => state.Conversations.Conversations);
    const ApiURL = useSelector(state => state.ApiURL.URL);

    useEffect(() => {
        Axios.get(`${ApiURL}/api/Users/Data`, {
            params: {
                ID: localStorage.getItem("User")
            }
        }).then((Data) => {
            dispatch(UpdateUserInfo({Name: Data.data.Name, Lastname: Data.data.Lastname, Email: Data.data.Email, ProfileImage: Data.data.ProfileImage}));
            Data.data.LastReadedConversation.isSelected = false;
            dispatch(SelectedConversation(Data.data.LastReadedConversation));
        });

        Axios.get(`${ApiURL}/api/Conversation/Search`, {
            params:{
                ID: localStorage.getItem("User")
            }
        }).then((Data) => {
            dispatch(UpdateConversations(Data.data));
        });

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(ScreenWidth >= 880){
            document.documentElement.style.setProperty("--Aside-Menu-Size", "490px");
        }
        else{
            document.documentElement.style.setProperty("--Aside-Menu-Size", "100%");
        }
    }, [ScreenWidth])

    useEffect(() => {
        Socket.emit("SetUser", {UserID: localStorage.getItem("User")});
    }, [Socket]);

    useEffect(() => {
        if(SectionType === "Conversation"){
            InputRef.current.value = "";
        }
        // eslint-disable-next-line
    }, [SectionType]);

    window.onbeforeunload = () => {
        if(localStorage.getItem("User") !== null){
            Disconnected();
        }
    };

    const Logout = () => {
        Disconnected();
        localStorage.removeItem("User");
        window.location.reload();
    }

    const Disconnected = () => {
        Socket.emit("UnsetUser", {UserID: localStorage.getItem("User")});    
    };

    const SearchPeople = (Value) => {
        if(Value.length > 0){
            Axios.get(`${ApiURL}/api/Users/Search`, {
                params: {
                    "UserID": localStorage.getItem("User"),
                    "Search": Value
                }
            }).then((Data) => {
                setSearchData(Data.data);
                dispatch(AsideStatus("Search"));
            });
        }
        else{
            dispatch(AsideStatus("Conversation"));
        }
    };

    const ChangeSection = (Section) => {
        switch(Section){
            case "Configuration":
                dispatch(AsideStatus("Configuration"));
            break;
            default:
                dispatch(AsideStatus("Conversation"));
            break;
        }
    }
    
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

    const ProfileImageModalShow = () => setShowProfileImageModal(true);
    
    const ProfileImageModalClose = () => {
        setShowProfileImageModal(false);
        setTimeout(() => {
            setProfileImageTemp("");
        }, 250);
    };
    
    const SaveProfileImage = () => {
        Axios.put(`${ApiURL}/api/Users/UpdatePI`, { ID: localStorage.getItem("User"), ProfileImage: ProfileImageTemp.split(",")[1] }).then((Data) => {
            if(Data.data === "Updated"){
                dispatch(UpdateUserInfo({ Name: FirstName, Lastname, ProfileImage: ProfileImageTemp.split(",")[1]}));
                ProfileImageModalClose();
            }
            else{
                Toast.error("Hubo un error al actualizar la imagen, intente nuevamente", "Error", { timeOut: 2500, showDuration: true, closeButton: true });
            }
        });
    }
    
    return(
        <aside className="vh-100 container-fluid AsideMenu">
            <div className="row h-100">
                {
                    ScreenWidth >= 880 &&
                    <section className="col-2 p-0 position-relative Menu mt-auto mb-auto">
                        <figure className="d-flex w-100 justify-content-center m-0 mt-3">
                            <img className="d-block w-75" src={iTalkIcon} alt="iTalk Icon" />
                        </figure>
                        <div className="w-100 AsideIcons mb-3">
                            <button className={`d-block mt-4 ms-auto me-auto border-0 ${SectionType === "Conversation" ? "SelectedMenu" : "bg-transparent"}`} onClick={() => ChangeSection("Conversation")}>
                                <ChatIcon className="IconColor"/>
                            </button>

                            <button className={`d-block mt-4 ms-auto me-auto border-0 ${SectionType === "Configuration" ? "SelectedMenu" : "bg-transparent"}`} onClick={() => ChangeSection("Configuration")}>
                                <ConfigIcon className="IconColor"/>
                            </button>

                            <button className="d-block mt-4 ms-auto me-auto border-0 bg-transparent" onClick={ Logout }>
                                <SignOutIcon className="IconColor"/>
                            </button>
                        </div>
                    </section>
                }

                <section className={`${ScreenWidth >= 880 ? 'col-10 ps-4' : 'col-12'} h-100 position-relative`}>
                    <section className="w-100">
                        <div className="d-flex ProfileInfo mt-4 ms-3">
                            <figure className="h-100 position-relative">
                                <img className="ProfileImageSize rounded-circle" src={`data:image/png;base64,${ProfileImage}`} alt="" onClick={ProfileImageModalShow}/>
                                <div className="ProfileStatusGreen rounded-circle"></div>
                            </figure>

                            <div>
                                <p className="ms-3 mb-0 text-black fw-bold fs-5 OneLineText">{`${FirstName} ${Lastname}`}</p>
                                <p className="ms-3 text-muted OneLineText">{t("Online")}</p>
                            </div>

                            {
                                ScreenWidth < 880 && SectionType === "Conversation" &&
                                <button className="d-block mt-2 ms-auto border-0 bg-transparent" onClick={() => ChangeSection("Configuration")} style={{width: "45px", height: "45px"}}>
                                    <ConfigIcon className="IconColor"/>
                                </button>
                            }

                            {
                                ScreenWidth < 880 && SectionType === "Configuration" &&
                                <button className="d-block mt-2 ms-auto border-0 bg-transparent" onClick={() => ChangeSection("Conversation")} style={{width: "45px", height: "45px"}}>
                                    <ChatIcon className="IconColor"/>
                                </button>
                            }
                        </div>

                        <hr className="p-0 m-0"/>

                        <div className="input-group mt-2">
                            <span className="input-group-text bg-light border-end-0" id="basic-addon1">
                                <svg width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                                </svg>
                            </span>
                            <input type="text" className="form-control border-start-0" ref={InputRef} placeholder={t("SearchDescription")} onChange={(e) => SearchPeople(e.target.value)}/>
                        </div>

                        <hr className={`p-0 mt-2 ${SectionType === "Search" ? "mb-2" : ""}`}/>

                        {
                            ScreenWidth >= 880 && 
                            <hr className="VerticalSeparator"/>
                        }
                        
                    </section>

                    <section className="h-75">
                        {
                            SectionType === "Conversation" ?
                            <ConversationList Conversations={Conversations} Socket={Socket}/>
                            :
                            SectionType === "Search" ?
                            <Search Data={SearchData}/>   
                            :
                            SectionType === "Configuration" ?
                            <Configuration Socket={Socket}/>
                            :
                            ""
                        }
                    </section>
                </section>
            </div>

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
                            <img className='d-block ms-auto me-auto rounded-circle' src={`data:image/png;base64,${ProfileImage}`} alt="" />
                            :
                            <img className='d-block ms-auto me-auto rounded-circle' src={ProfileImageTemp} alt="" />
                        }
                    </figure>
                </Modal.Body>

                <Modal.Footer>
                    <button className='btn btn-secondary' onClick={ProfileImageModalClose}>{ t("ProfileImageModalCancel") }</button>

                    <label htmlFor="ProfileImageFile" className='btn btn-primary'>{ t("LoadImage") }</label>
                    <input id="ProfileImageFile" className='d-none' accept="image/png, image/gif, image/jpeg" disabled={LoadingProfileImage === true} type="file" onChange={(e) => LoadProfileImage(e.target.files[0])}/>

                    {
                        ProfileImageTemp !== "" &&
                        <button className='btn btn-primary' onClick={SaveProfileImage}>{ t("SaveChanges") }</button>
                    }
                </Modal.Footer>
            </Modal>
        </aside>
    ); 
}