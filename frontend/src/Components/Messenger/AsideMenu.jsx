import React from 'react'
import iTalkIcon from "../../Assets/iTalk_Icon.png";
import EmptyMale from "../../Assets/icons/EmptyMaleProfile.png";
import EmptyFemale from "../../Assets/icons/EmptyFemaleProfile.png";

/* Components */
import ConversationList from './ConversationList';

/* Icons */
import { ReactComponent as UsersIcon } from '../../Assets/icons/Users.svg';
import { ReactComponent as ChatIcon } from '../../Assets/icons/Chat.svg';
import { ReactComponent as ConfigIcon } from '../../Assets/icons/Config.svg';
import { ReactComponent as SignOutIcon } from '../../Assets/icons/SignOut.svg';

export default function AsideMenu({ SelectedMenu }){
    
    const Logout = () => {
        localStorage.removeItem("User");
        window.location.reload();
    }

    return(
        <aside className="w-100 vh-100 container-fluid AsideMenu">
            <div className="row h-100">
                <section className="col-2 p-0 position-relative Menu mt-auto mb-auto">
                    <figure className="d-flex w-100 justify-content-center m-0 mt-3">
                        <img className="d-block w-75" src={iTalkIcon} alt="iTalk Icon" />
                    </figure>

                    <div className="w-100 AsideIcons">
                        <button className={`d-block w-50 ms-auto me-auto border-0 ${SelectedMenu === "Contacts" ? "SelectedMenu" : "bg-transparent"}`}>
                            <UsersIcon className="IconColor"/>
                        </button>

                        <button className={`d-block w-50 mt-4 ms-auto me-auto border-0 ${SelectedMenu === "Conversations" ? "SelectedMenu" : "bg-transparent"}`}>
                            <ChatIcon className="IconColor"/>
                        </button>

                        <button className={`d-block w-50 mt-4 ms-auto me-auto border-0 ${SelectedMenu === "Configuration" ? "SelectedMenu" : "bg-transparent"}`}>
                            <ConfigIcon className="IconColor"/>
                        </button>
                    </div>

                    <button className="d-block position-absolute bottom-0 pb-2 w-50 start-50 translate-middle mt-4 ms-auto me-auto border-0 bg-transparent" onClick={ Logout }>
                        <SignOutIcon className="IconColor"/>
                    </button>
                </section>

                <section className="col-10 h-100 ps-4 position-relative">
                    <section className="w-100">
                        <div className="d-flex ProfileInfo mt-4 ms-3">
                            <figure className="h-100 position-relative">
                                <img className="ProfileImageSize rounded-circle" src={EmptyFemale} alt="" />
                                <div className="ProfileStatusGreen rounded-circle"></div>
                            </figure>

                            <div>
                                <p className="ms-3 mb-0 text-black fw-bold fs-5">Stephanie Jhonson</p>
                                <p className="ms-3 text-muted">En Línea</p>
                            </div>
                        </div>

                        <hr className="p-0 m-0"/>

                        <div className="input-group mt-2">
                            <span className="input-group-text bg-light border-end-0" id="basic-addon1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                                </svg>
                            </span>
                            <input type="text" className="form-control border-start-0" placeholder="Search people"/>
                        </div>

                        <hr className="p-0 mt-2"/>

                        <hr className="VerticalSeparator"/>
                    </section>

                    <section className="h-75">
                        <ConversationList/>
                    </section>
                </section>
            </div>
        </aside>
    ); 
}