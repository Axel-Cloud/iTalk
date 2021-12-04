import React, { useEffect } from 'react'
import ScreenDimensions from "../../Others/useScreenDimensions";
import { useDispatch } from 'react-redux';
import { SelectedConversation } from '../../Store/SelectedConversation/action';

//Time Ago
import TimeAgo from "react-timeago";
import EnglishStrings from "react-timeago/lib/language-strings/en-short";
import SpanishStrings from "react-timeago/lib/language-strings/es-short";
import FrenchStrings from "react-timeago/lib/language-strings/fr-short";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

export default function ConversationsList({ Conversations }){
    const { ScreenHeight } = ScreenDimensions();
    const ConversationListRef = React.createRef();
    const dispatch = useDispatch();

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
        document.documentElement.style.setProperty("--Conversation-List-Height", `${ScreenHeight - ConversationListRef.current.getBoundingClientRect().top}px`);
    }, [ScreenHeight, ConversationListRef])

    const ChangeConversation = (Conversation) => {
        dispatch(SelectedConversation(Conversation.SecondUser));
    }

    return (
        <section className="ConversationList" ref={ ConversationListRef }>
            <ul className="p-0 mb-0">
                {
                    Conversations.map((Conversation) => {
                        return (
                            Conversation !== null &&
                            <li key={Conversation._id} className="position-relative" onClick={() => ChangeConversation(Conversation)}>
                                <article className="d-flex align-items-center h-100 ms-1">
                                    <figure className="h-100 position-relative">
                                        <img className="ProfileImageSize rounded-circle" src={`data:image/png;base64,${Conversation.SecondUser.ProfileImage}`} alt="" />
                                        <div className="ProfileStatusGreen rounded-circle"></div>
                                    </figure>

                                    <div className="container-fluid pe-0">
                                        <div className="row">
                                            <p className="col-10 ps-0 mb-0 text-black fw-bold fs-6">{`${Conversation.SecondUser.Name} ${Conversation.SecondUser.Lastname}`}</p>
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