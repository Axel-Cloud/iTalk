import React, { useState, useEffect } from 'react';
import Axios from "axios";
import ScrollToBottom from 'react-scroll-to-bottom';
import { useTranslation } from "react-i18next";
import ScreenDimensions from "../../Others/useScreenDimensions";
import MD5 from "md5";

/* Icons */
import { ReactComponent as SendIcon } from '../../Assets/icons/Send.svg';
import { ReactComponent as BackArrow } from '../../Assets/icons/BackArrow.svg';

/* Redux */
import { useSelector, useDispatch, useStore } from "react-redux";
import { SelectedConversation as SelectedConversationAux } from '../../Store/SelectedConversation/action';
import { ConversationMessages } from "../../Store/ConversationMessages/action";
import { UpdateConversations } from "../../Store/Conversations/action";

export default function Chat({ Socket }) {
    const [Message, setMessage] = useState("");
    const [TARows, setTARows] = useState(1)
    const [FirstLineLength, setFirstLineLength] = useState(0);
    const [SecondLineLength, setSecondLineLength] = useState(0);

    const { ScreenWidth } = ScreenDimensions();

    const dispatch = useDispatch();
    const { t } = useTranslation("Messenger");
    const MessageInputRef = React.createRef();
    const SendButtonRef = React.createRef();

    const store = useStore();
    const SelectedConversation = useSelector(state => state.SelectedConversation);
    const ProfileImage = useSelector(state => state.UserInfo.ProfileImage);
    const Messages = useSelector(state => state.ConversationMessages.Messages);
    const ApiURL = useSelector(state => state.ApiURL.URL);
    
    useEffect(() => {
        Socket.on(localStorage.getItem("User"), (NewMessage) => {
            let MessagesAux = store.getState().ConversationMessages.Messages;
            let SelectedConversationAux = store.getState().SelectedConversation;

            if(NewMessage.UserID === SelectedConversationAux.ID){
                
                if(MessagesAux !== undefined && MessagesAux !== []){
                    dispatch(ConversationMessages([...MessagesAux, NewMessage]));
                }
                else{
                    dispatch(ConversationMessages([NewMessage]));
                }
                
                Axios.put(`${ApiURL}/api/Conversation`, {
                    ConversationID: SelectedConversationAux.ID < localStorage.getItem("User") ? MD5(`${SelectedConversationAux.ID}${localStorage.getItem("User")}`) : MD5(`${localStorage.getItem("User")}${SelectedConversationAux.ID}`),
                    UserID: localStorage.getItem("User")
                }).then(() => {
                    UpdateListConversation();
                });
            }
            else if(NewMessage.UserID === localStorage.getItem("User")){
                if(MessagesAux !== undefined && MessagesAux !== []){
                    dispatch(ConversationMessages([...MessagesAux, NewMessage]));
                }
                else{
                    dispatch(ConversationMessages([NewMessage]));
                }

                UpdateListConversation();
            }
            else{
                UpdateListConversation();
            }
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        MessageInputRef.current.focus();
    }, [MessageInputRef])

    useEffect(() => {
        document.documentElement.style.setProperty("--MessageList-Height", TARows === 1 ? "94%" : TARows === 2 ? "91.5%" : "89%");  
        document.documentElement.style.setProperty("--MessageField-Height", TARows === 1 ? "6%" : TARows === 2 ? "8.5%" : "11%");
        document.documentElement.style.setProperty("--MessageIcon-Height", TARows === 1 ? "37%" : TARows === 2 ? "27%" : "22.5%");
    }, [TARows]);

    useEffect(() => {
        let UpdateReaded = false;

        if(SelectedConversation.ID === MD5(localStorage.getItem("User"))){
            MessageInputRef.current.disabled = true;
            SendButtonRef.current.disabled = true;
        }
        else{
            MessageInputRef.current.disabled = false;
            SendButtonRef.current.disabled = false;
            UpdateReaded = true;
        }

        Axios.get(`${ApiURL}/api/Conversation`, {
            params: {
                ID: SelectedConversation.ID === MD5(localStorage.getItem("User")) ? MD5(localStorage.getItem("User")) : SelectedConversation.ID < localStorage.getItem("User") ? MD5(`${SelectedConversation.ID}${localStorage.getItem("User")}`) : MD5(`${localStorage.getItem("User")}${SelectedConversation.ID}`)
            }
        }).then((Data) => {
            dispatch(ConversationMessages(Data.data.Conversation));
            
            if(SelectedConversation.ID !== "" && UpdateReaded && Data.data.Conversation[Data.data.Conversation.length - 1].UserID !== localStorage.getItem("User") && Data.data.Conversation[Data.data.Conversation.length - 1].Readed === false){
                Axios.put(`${ApiURL}/api/Conversation`, {
                    ConversationID: SelectedConversation.ID === MD5(localStorage.getItem("User")) ? MD5(localStorage.getItem("User")) : SelectedConversation.ID < localStorage.getItem("User") ? MD5(`${SelectedConversation.ID}${localStorage.getItem("User")}`) : MD5(`${localStorage.getItem("User")}${SelectedConversation.ID}`),
                    UserID: localStorage.getItem("User")
                });
            }
        });

        // eslint-disable-next-line
    }, [SelectedConversation]);

    const ChangeMessage = (e) => {
        setMessage(e.target.value);

        if(FirstLineLength === 0 && Math.ceil(e.target.scrollHeight / 36) === 2){
            setFirstLineLength(e.target.value.length - 1);
        }

        if(SecondLineLength === 0 && Math.ceil(e.target.scrollHeight / 36) === 3){
            setSecondLineLength(e.target.value.length - 1);
        }

        if(e.target.value.length <= FirstLineLength && TARows > 1){
            setTARows(1);
        }
        else if(e.target.value.length <= SecondLineLength && TARows > 2){
            setTARows(2);
        }
        else if(Math.ceil(e.target.scrollHeight / 36) !== TARows){
            setTARows(Math.ceil(e.target.scrollHeight / 36) > 3 ? 3 : Math.ceil(e.target.scrollHeight / 36));
        }
    };

    const SendMessage = (e) => {
        if(e.type === "keypress"){
            e.preventDefault();
        }

        if(Message.trim().length > 0){
            MessageInputRef.current.value = "";
            Socket.emit("Message", {ConversationID: SelectedConversation.ID === "" ? MD5(localStorage.getItem("User")) : SelectedConversation.ID < localStorage.getItem("User") ? MD5(`${SelectedConversation.ID}${localStorage.getItem("User")}`) : MD5(`${localStorage.getItem("User")}${SelectedConversation.ID}`), EmitterID: localStorage.getItem("User"), RecieverID: SelectedConversation.ID,  Message});
        }
    };

    const UpdateListConversation = () => {
        Axios.get(`${ApiURL}/api/Conversation/Search`, {
            params:{
                ID: localStorage.getItem("User")
            }}).then((Data) => {
                dispatch(UpdateConversations(Data.data));
        });
    };

    const ReturnConversationList = () => {
        dispatch(SelectedConversationAux({isSelected: false}));
    };

    return (
        <section className="vh-100 w-100 Chat">
            <div className="MessageList">
                <section>
                    <article className="d-flex align-items-center h-100 w-100 ms-1">
                        {
                            ScreenWidth < 880 &&
                            <button className='bg-transparent border-0 me-2' style={{width: "35px", maxWidth: "35px"}} onClick={ReturnConversationList}>
                                <BackArrow style={{width: "100%"}}/>
                            </button>
                        }
                        
                        <figure className="h-100 position-relative VerticalFigure">
                            <img className="ProfileImageSize rounded-circle" src={`data:image/png;base64,${SelectedConversation.ProfileImage}`} alt="" />
                            <div className={`${SelectedConversation.Online ? "ProfileStatusGreen" : "ProfileStatusGray"} rounded-circle`}></div>
                        </figure>

                        {
                            SelectedConversation.ID === MD5(localStorage.getItem("User")) ?
                            <p className="ps-0 mb-0 ms-3 fw-bold fs-5">{t("iTalkSupport")}</p>
                            :
                            <p className="ps-0 mb-0 ms-3 fw-bold fs-5">{`${SelectedConversation.Name} ${SelectedConversation.Lastname}`}</p>
                        }
                    </article>
                </section>

                <hr className={`mt-0 ${ScreenWidth >= 880 ? "me-4" : "ms-3 me-3"} `}/>

                <ScrollToBottom className="Messages">
                    {
                        Messages !== null && Messages !== undefined &&
                        Messages.map((message, Index) => {
                            return (
                                <div key={message._id} className={`d-flex ${message.UserID === localStorage.getItem("User") ? "justify-content-end" : "justify-content-start"} ${Index === 0 ? "mt-1" : Messages[Index - 1].UserID === Messages[Index].UserID ? "mt-2" : "mt-4"} w-100 Message`}>
                                    {
                                        message.UserID !== localStorage.getItem("User") &&
                                        <figure className={`h-100 position-relative VerticalFigure me-2 ${ScreenWidth < 880 ? "ms-3" : "ms-2"}`}>
                                            <img className="w-100 h-100 rounded-circle" src={`data:image/png;base64,${SelectedConversation.ProfileImage}`} alt="" />
                                        </figure>
                                    }

                                    <span id={`Message-${message._id}`} className={`p-2 ps-3 pe-3`}>
                                        <p>{message.Message}</p>
                                    </span>

                                    {
                                        MD5(localStorage.getItem("User")) !== SelectedConversation.ID &&
                                        message.UserID === localStorage.getItem("User") &&
                                        <figure className="h-100 position-relative VerticalFigure ms-2 me-2">
                                            <img className="w-100 h-100 rounded-circle" src={`data:image/png;base64,${ProfileImage}`} alt="" />
                                        </figure>
                                    }

                                    {
                                        MD5(localStorage.getItem("User")) === SelectedConversation.ID &&
                                        message.UserID === localStorage.getItem("User") &&
                                        <figure className="h-100 position-relative VerticalFigure ms-2 me-2">
                                            <img className="w-100 h-100 rounded-circle" src={`data:image/png;base64,${SelectedConversation.ProfileImage}`} alt="" />
                                        </figure>
                                    }
                                </div>
                            );
                        })
                    }
                </ScrollToBottom>
            </div>

            <div className="d-flex MessageField">
                <div className="h-100 ms-3 me-2">
                    <textarea className="form-control" rows={TARows} ref={MessageInputRef} onChange={(e) => ChangeMessage(e)} onKeyPress={(e) => {if(e.code === "Enter" || e.code === "NumpadEnter"){SendMessage(e)}}}/>
                </div>

                <button className="d-block w-auto h-100 border-0 me-4" ref={SendButtonRef} onClick={(e) => SendMessage(e)}>
                    <SendIcon className="MessageIcon SendIcon"/>
                </button>
            </div>
        </section>
    )
}
