import React, { useState, useEffect } from 'react'
import { io } from "socket.io-client";
//Components
import Messages from "./Message";

//Images
import { ReactComponent as ClipIcon } from '../../Assets/icons/Clip.svg';
import { ReactComponent as SendIcon } from '../../Assets/icons/Send.svg';

export default function Chat() {
    const [Message, setMessage] = useState("");
    const [TARows, setTARows] = useState(1)
    const [FirstLineLength, setFirstLineLength] = useState(0);
    const [SecondLineLength, setSecondLineLength] = useState(0);

    const Socket = io("http://localhost:3001");

    useEffect(() => {
        Socket.on("Message", ({UserID, Message}) => {
            console.log(UserID, Message);
        })
    }, [])

    useEffect(() => {
        document.documentElement.style.setProperty("--MessageList-Height", TARows === 1 ? "94%" : TARows === 2 ? "91.5%" : "89%");
        document.documentElement.style.setProperty("--MessageField-Height", TARows === 1 ? "6%" : TARows === 2 ? "8.5%" : "11%");
        document.documentElement.style.setProperty("--MessageIcon-Height", TARows === 1 ? "37%" : TARows === 2 ? "27%" : "22.5%");
    }, [TARows])

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
    }

    const SendMessage = (e) => {
        if(e.type === "keypress"){
            e.preventDefault();
        }
               
        Socket.emit("Message", {UserID: localStorage.getItem("User"), Message});
    }

    return (
        <section className="vh-100 w-100 Chat">
            <div className="MessageList">
                <Messages Message="Probando algo fuerte aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" UserID="6196e43e9f62271c580cbdb9"/>
                <Messages Message="Probando algo fuerte aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" UserID="6196e43e9f62271c580cbdb9a"/>
                <Messages Message="Probando algo fuerte aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" UserID="6196e43e9f62271c580cbdb9"/>
            </div>

            <div className="d-flex MessageField">
                <button className="d-block w-auto h-100 border-0">
                    <ClipIcon className="MessageIcon"/>
                </button>

                <div className="h-100 ms-3 me-2">
                    <textarea className="form-control" rows={TARows} onChange={(e) => ChangeMessage(e)} onKeyPress={(e) => {if(e.code === "Enter" || e.code === "NumpadEnter"){SendMessage(e)}}}/>
                </div>

                <button className="d-block w-auto h-100 border-0 me-4" onClick={(e) => SendMessage(e)}>
                    <SendIcon className="MessageIcon SendIcon"/>
                </button>
            </div>
        </section>
    )
}
