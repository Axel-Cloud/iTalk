import React, { useState, useEffect } from 'react';
import Axios from "axios";
import { io } from "socket.io-client";
import { ConversationMessages } from "../../Store/ConversationMessages/action";
import { useSelector, useDispatch } from "react-redux";
import ScrollToBottom from 'react-scroll-to-bottom';
import MD5 from "md5";

//Images
import { ReactComponent as SendIcon } from '../../Assets/icons/Send.svg';

export default function Chat() {
    const [Message, setMessage] = useState("");
    const [TARows, setTARows] = useState(1)
    const [FirstLineLength, setFirstLineLength] = useState(0);
    const [SecondLineLength, setSecondLineLength] = useState(0);

    const Socket = io("http://localhost:3001");

    const dispatch = useDispatch();
    const MessageInputRef = React.createRef();
    const SendButtonRef = React.createRef();

    const SelectedConversation = useSelector(state => state.SelectedConversation);
    const Messages = useSelector(state => state.ConversationMessages.Messages);

    useEffect(() => {
        Socket.connect();

        Socket.on(localStorage.getItem("User"), (NewMessage) => {
            if(ConversationMessages !== undefined){
                if(NewMessage.UserID === SelectedConversation.ID || NewMessage.UserID === localStorage.getItem("User")){
                    dispatch(ConversationMessages([...Messages, NewMessage]));
                }
            }
        });

        return () => {
            setTimeout(() => {
                Socket.disconnect();
            }, 50);
        }
        // eslint-disable-next-line
    }, [Messages])

    useEffect(() => {
        MessageInputRef.current.focus();
    }, [MessageInputRef])

    useEffect(() => {
        document.documentElement.style.setProperty("--MessageList-Height", TARows === 1 ? "94%" : TARows === 2 ? "91.5%" : "89%");  
        document.documentElement.style.setProperty("--MessageField-Height", TARows === 1 ? "6%" : TARows === 2 ? "8.5%" : "11%");
        document.documentElement.style.setProperty("--MessageIcon-Height", TARows === 1 ? "37%" : TARows === 2 ? "27%" : "22.5%");
    }, [TARows]);

    useEffect(() => {
        if(SelectedConversation.ID === MD5(localStorage.getItem("User"))){
            MessageInputRef.current.disabled = true;
            SendButtonRef.current.disabled = true;
        }
        else{
            MessageInputRef.current.disabled = false;
            SendButtonRef.current.disabled = false;
        }

        Axios.get("http://localhost:3001/api/Conversation", {
            params: {
                ID: SelectedConversation.ID === MD5(localStorage.getItem("User")) ? MD5(localStorage.getItem("User")) : SelectedConversation.ID < localStorage.getItem("User") ? MD5(`${SelectedConversation.ID}${localStorage.getItem("User")}`) : MD5(`${localStorage.getItem("User")}${SelectedConversation.ID}`) 
            }
        }).then((Data) => {
            dispatch(ConversationMessages(Data.data.Conversation));
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

    return (
        <section className="vh-100 w-100 Chat">
            <div className="MessageList">
                <section>
                    <article className="d-flex align-items-center h-100 w-100 ms-1">
                        <figure className="h-100 position-relative VerticalFigure">
                            <img className="ProfileImageSize rounded-circle" src={`data:image/png;base64,${SelectedConversation.ProfileImage}`} alt="" />
                            <div className={`${SelectedConversation.Online ? "ProfileStatusGreen" : "ProfileStatusRed"} rounded-circle`}></div>
                        </figure>

                        <p className="ps-0 mb-0 ms-3 fw-bold fs-5">{`${SelectedConversation.Name} ${SelectedConversation.Lastname}`}</p>
                    </article>
                </section>

                <hr className="mt-0 me-4"/>

                <ScrollToBottom className="Messages">
                    {
                        Messages.map((message, Index) => {
                            return (
                                <div key={message._id} className={`d-flex ${message.UserID === localStorage.getItem("User") ? "justify-content-end" : "justify-content-start"} ${Index === 0 ? "mt-1" : Messages[Index - 1].UserID === Messages[Index].UserID ? "mt-2" : "mt-4"} w-100 Message`}>
                                    {
                                        message.UserID !== localStorage.getItem("User") &&
                                        <figure className="h-100 position-relative VerticalFigure me-2">
                                            <img className="w-100 h-100 rounded-circle" src={`data:image/png;base64,${SelectedConversation.ProfileImage}`} alt="" />
                                        </figure>
                                    }

                                    <span id={`Message-${message._id}`} className={`p-2 ps-3 pe-3`}>
                                        <p>{message.Message}</p>
                                    </span>

                                    {
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
