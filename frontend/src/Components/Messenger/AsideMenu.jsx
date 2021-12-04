import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { AsideStatus } from "../../Store/AsideMenuStatus/action";
import Axios from 'axios';
import { io } from "socket.io-client";

/* Components */
import ConversationList from './ConversationList';
import Search from "./Search";

//Images
import iTalkIcon from "../../Assets/iTalk_Icon.png";

/* Icons */
import { ReactComponent as ChatIcon } from '../../Assets/icons/Chat.svg';
import { ReactComponent as ConfigIcon } from '../../Assets/icons/Config.svg';
import { ReactComponent as SignOutIcon } from '../../Assets/icons/SignOut.svg';
import { SelectedConversation } from '../../Store/SelectedConversation/action';

export default function AsideMenu(){
    //Search, conversation list, and configuration
    const [CompleteName, setCompleteName] = useState("");
    const [ProfileImage, setProfileImage] = useState("")
    const [SearchData, setSearchData] = useState([]);
    const [Conversations, setConversations] = useState([]);

    const dispatch = useDispatch();
    const InputRef = React.createRef();
    const SectionType = useSelector(state => state.StatusAsideMenu.Status);
    const Socket = io("http://localhost:3001");

    useEffect(() => {
        Axios.get("http://localhost:3001/api/Users/Data", {
            params: {
                ID: localStorage.getItem("User")
            }
        }).then((Data) => {
            setCompleteName(`${Data.data.Name} ${Data.data.Lastname}`);
            setProfileImage(Data.data.ProfileImage);
            dispatch(SelectedConversation(Data.data.LastReadedConversation));
        });

        Axios.get("http://localhost:3001/api/Conversation/Search", {
            params:{
                ID: localStorage.getItem("User")
            }
        }).then((Data) => {
            setConversations(Data.data);
        });

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        Socket.emit("SetUser", {UserID: localStorage.getItem("User")});
    }, [Socket])

    useEffect(() => {
        if(SectionType === "Conversation"){
            InputRef.current.value = "";
        }
    }, [SectionType, InputRef])

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
            Axios.get("http://localhost:3001/api/Users/Search", {
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

    return(
        <aside className="w-100 vh-100 container-fluid AsideMenu">
            <div className="row h-100">
                <section className="col-2 p-0 position-relative Menu mt-auto mb-auto">
                    <figure className="d-flex w-100 justify-content-center m-0 mt-3">
                        <img className="d-block w-75" src={iTalkIcon} alt="iTalk Icon" />
                    </figure>

                    <div className="w-100 AsideIcons mb-3">
                        <button className={`d-block mt-4 ms-auto me-auto border-0 ${SectionType === "Conversations" ? "SelectedMenu" : "bg-transparent"}`}>
                            <ChatIcon className="IconColor"/>
                        </button>

                        <button className={`d-block mt-4 ms-auto me-auto border-0 ${SectionType === "Configuration" ? "SelectedMenu" : "bg-transparent"}`}>
                            <ConfigIcon className="IconColor"/>
                        </button>

                        <button className="d-block mt-4 ms-auto me-auto border-0 bg-transparent" onClick={ Logout }>
                            <SignOutIcon className="IconColor"/>
                        </button>
                    </div>
                </section>

                <section className="col-10 h-100 ps-4 position-relative">
                    <section className="w-100">
                        <div className="d-flex ProfileInfo mt-4 ms-3">
                            <figure className="h-100 position-relative">
                                <img className="ProfileImageSize rounded-circle" src={`data:image/png;base64,${ProfileImage}`} alt="" />
                                <div className="ProfileStatusGreen rounded-circle"></div>
                            </figure>

                            <div>
                                <p className="ms-3 mb-0 text-black fw-bold fs-5">{CompleteName}</p>
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
                            <input type="text" className="form-control border-start-0" ref={InputRef} placeholder="Find people to talk" onChange={(e) => SearchPeople(e.target.value)}/>
                        </div>

                        <hr className={`p-0 mt-2 ${SectionType === "Search" ? "mb-2" : ""}`}/>

                        <hr className="VerticalSeparator"/>
                    </section>

                    <section className="h-75">
                        {
                            SectionType === "Conversation" ?
                            <ConversationList Conversations={Conversations}/>
                            :
                            SectionType === "Search" ?
                            <Search Data={SearchData}/>   
                            :
                            <p>Configuration</p>
                        }
                    </section>
                </section>
            </div>
        </aside>
    ); 
}