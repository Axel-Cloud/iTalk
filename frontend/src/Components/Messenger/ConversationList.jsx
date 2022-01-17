import React, { useEffect } from 'react'
import ScreenDimensions from "../../Others/useScreenDimensions";
import MD5 from 'md5';
import Axios from 'axios';
import { io } from "socket.io-client";
import { useTranslation } from 'react-i18next';

/* Redux */
import { useSelector, useDispatch } from 'react-redux';
import { SelectedConversation } from '../../Store/SelectedConversation/action';
import { ConversationMessages } from "../../Store/ConversationMessages/action";
import { UpdateConversations } from "../../Store/Conversations/action";

/* Time Ago */
import TimeAgo from "react-timeago";
import EnglishStrings from "react-timeago/lib/language-strings/en-short";
import SpanishStrings from "react-timeago/lib/language-strings/es-short";
import FrenchStrings from "react-timeago/lib/language-strings/en-short";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

export default function ConversationsList({ Conversations }){
    const { ScreenWidth, ScreenHeight } = ScreenDimensions();
    const { t } = useTranslation("Messenger");
    const ConversationListRef = React.createRef();

    const ApiURL = useSelector(state => state.ApiURL.URL);

    const dispatch = useDispatch();
    const Socket = io(ApiURL);

    const EnglishFormatter = buildFormatter(EnglishStrings);
    const SpanishFormatter = buildFormatter(SpanishStrings);
    const FrenchFormatter = buildFormatter(FrenchStrings);

    useEffect(() => {
        ConversationListRef.current.addEventListener("mouseenter", (e) => {
            document.documentElement.style.setProperty("--Scroll-Width", "7.5px");
        });

        ConversationListRef.current.addEventListener("mouseleave", (e) => {
            document.documentElement.style.setProperty("--Scroll-Width", "0px");
        });
    }, [ConversationListRef])

    useEffect(() => {
        Socket.connect();

        Socket.on(localStorage.getItem("User"), (NewMessage) => {
            if(ScreenWidth < 880){
                Axios.get(`${ApiURL}/api/Conversation/Search`, {
                    params:{
                        ID: localStorage.getItem("User")
                    }}).then((Data) => {
                        dispatch(UpdateConversations(Data.data));
                });
            }
        });

        return () => {
            setTimeout(() => {
                Socket.disconnect();
            }, 50);
        }
        // eslint-disable-next-line
    }, [Conversations])

    useEffect(() => {
        document.documentElement.style.setProperty("--Conversation-List-Height", `${ScreenHeight - ConversationListRef.current.getBoundingClientRect().top}px`);
    }, [ScreenHeight, ConversationListRef])

    const ChangeConversation = (Index) => {
        let ConversationsAux = Conversations.slice();
        ConversationsAux[Index].Conversation.UnreadedMessages = 0;

        dispatch(UpdateConversations(ConversationsAux));
        dispatch(ConversationMessages([]));
        Conversations[Index].SecondUser.isSelected = true;
        dispatch(SelectedConversation(Conversations[Index].SecondUser));
    }

    return (
        <section className="ConversationList" ref={ ConversationListRef }>
            <ul className="p-0 mb-0">
                {
                    Conversations.map((Conversation, Index) => {
                        return (
                            Conversation !== null &&
                            <li key={Conversation._id} className="position-relative" onClick={() => ChangeConversation(Index)}>
                                <article className="d-flex align-items-center h-100 ms-1">
                                    <figure className="h-100 position-relative">
                                        <img className="ProfileImageSize rounded-circle" src={`data:image/png;base64,${Conversation.SecondUser.ProfileImage}`} alt="" />
                                        <div className={`${Conversation.SecondUser.Online === true ? "ProfileStatusGreen" : "ProfileStatusGray"} rounded-circle`}></div>
                                    </figure>

                                    <div className="container-fluid pe-0">
                                        <div className="row">
                                            {
                                                Conversation.SecondUser._id !== MD5(localStorage.getItem("User")) ?
                                                <p className="col-10 ps-0 mb-0 text-black fw-bold fs-6 OneLineText">{`${Conversation.SecondUser.Name} ${Conversation.SecondUser.Lastname}`}</p>
                                                :
                                                <p className="col-10 ps-0 mb-0 text-black fw-bold fs-6 OneLineText">{t("iTalkSupport")}</p>
                                            }
                                            
                                            <p className="col-2 ps-0 mb-0 text-black fs-6 text-end pe-3">
                                                <TimeAgo date={Date.parse(Conversation.Conversation.LastMessageDate)} formatter={localStorage.getItem("Lang") === "fr" ? FrenchFormatter : localStorage.getItem("Lang") === "es" ? SpanishFormatter : EnglishFormatter} />
                                            </p>
                                            <p className="col-9 ps-0 mt-1 text-muted LastMessage">{Conversation.Conversation.LastMessage}</p>
                                            
                                            {
                                                Conversation.Conversation.UnreadedMessages > 0 &&
                                                <div className="col-3 UnreadMessage ms-auto me-3 p-0">
                                                    <p className="text-white text-center">{Conversation.Conversation.UnreadedMessages}</p>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </article>
                            </li>
                        );
                    })
                }
            </ul>
        </section>
    );
}