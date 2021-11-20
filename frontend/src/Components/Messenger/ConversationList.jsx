import React, { useEffect } from 'react'
import ScreenDimensions from "../../Others/useScreenDimensions";
import EmptyFemale from "../../Assets/icons/EmptyFemaleProfile.png";

export default function ConversationsList(){
    const { ScreenHeight } = ScreenDimensions();
    const ConversationListRef = React.createRef();

    useEffect(() => {
        ConversationListRef.current.addEventListener("mouseenter", (e) => {
            document.documentElement.style.setProperty("--Scroll-Width", "7.5px");
        });

        ConversationListRef.current.addEventListener("mouseleave", (e) => {
            document.documentElement.style.setProperty("--Scroll-Width", "0px");
        });
    }, [])

    useEffect(() => {
        document.documentElement.style.setProperty("--Conversation-List-Height", `${ScreenHeight - ConversationListRef.current.getBoundingClientRect().top}px`);
    }, [ScreenHeight])

    return (
        <section className="ConversationList" ref={ ConversationListRef }>
            <ul className="p-0 mb-0">
                <li className="position-relative">
                    <article className="d-flex align-items-center h-100 ms-1">
                        <figure className="h-100 position-relative">
                            <img className="ProfileImageSize rounded-circle" src={EmptyFemale} alt="" />
                            <div className="ProfileStatusGreen rounded-circle"></div>
                        </figure>

                        <div className="container-fluid pe-0">
                            <div className="row">
                                <p className="col-10 ps-0 mb-0 text-black fw-bold fs-6">Skylar Salazar</p>
                                <p className="col-2 ps-0 mb-0 text-black fs-6 text-end pe-3">5m</p>
                                <p className="col-9 ps-0 mt-1 text-muted LastMessage">Yesterday i was there, at the restaurant!</p>
                                
                                <div className="col-3 UnreadMessage ms-auto me-3 p-0">
                                    <p className="text-white text-center">1</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </li>

                <li className="position-relative">
                    <article className="d-flex align-items-center h-100 ms-1">
                        <figure className="h-100 position-relative">
                            <img className="ProfileImageSize rounded-circle" src={EmptyFemale} alt="" />
                            <div className="ProfileStatusGreen rounded-circle"></div>
                        </figure>

                        <div className="container-fluid pe-0">
                            <div className="row">
                                <p className="col-10 ps-0 mb-0 text-black fw-bold fs-6">Skylar Salazar</p>
                                <p className="col-2 ps-0 mb-0 text-black fs-6 text-end pe-3">5m</p>
                                <p className="col-9 ps-0 mt-1 text-muted LastMessage">Yesterday i was there, at the restaurant!</p>
                                
                                <div className="col-3 UnreadMessage ms-auto me-3 p-0">
                                    <p className="text-white text-center">1</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </li>

                <li className="position-relative">
                    <article className="d-flex align-items-center h-100 ms-1">
                        <figure className="h-100 position-relative">
                            <img className="ProfileImageSize rounded-circle" src={EmptyFemale} alt="" />
                            <div className="ProfileStatusGreen rounded-circle"></div>
                        </figure>

                        <div className="container-fluid pe-0">
                            <div className="row">
                                <p className="col-10 ps-0 mb-0 text-black fw-bold fs-6">Skylar Salazar</p>
                                <p className="col-2 ps-0 mb-0 text-black fs-6 text-end pe-3">5m</p>
                                <p className="col-9 ps-0 mt-1 text-muted LastMessage">Yesterday i was there, at the restaurant!</p>
                                
                                <div className="col-3 UnreadMessage ms-auto me-3 p-0">
                                    <p className="text-white text-center">1</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </li>

                <li className="position-relative">
                    <article className="d-flex align-items-center h-100 ms-1">
                        <figure className="h-100 position-relative">
                            <img className="ProfileImageSize rounded-circle" src={EmptyFemale} alt="" />
                            <div className="ProfileStatusGreen rounded-circle"></div>
                        </figure>

                        <div className="container-fluid pe-0">
                            <div className="row">
                                <p className="col-10 ps-0 mb-0 text-black fw-bold fs-6">Skylar Salazar</p>
                                <p className="col-2 ps-0 mb-0 text-black fs-6 text-end pe-3">5m</p>
                                <p className="col-9 ps-0 mt-1 text-muted LastMessage">Yesterday i was there, at the restaurant!</p>
                                
                                <div className="col-3 UnreadMessage ms-auto me-3 p-0">
                                    <p className="text-white text-center">1</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </li>

                <li className="position-relative">
                    <article className="d-flex align-items-center h-100 ms-1">
                        <figure className="h-100 position-relative">
                            <img className="ProfileImageSize rounded-circle" src={EmptyFemale} alt="" />
                            <div className="ProfileStatusGreen rounded-circle"></div>
                        </figure>

                        <div className="container-fluid pe-0">
                            <div className="row">
                                <p className="col-10 ps-0 mb-0 text-black fw-bold fs-6">Skylar Salazar</p>
                                <p className="col-2 ps-0 mb-0 text-black fs-6 text-end pe-3">5m</p>
                                <p className="col-9 ps-0 mt-1 text-muted LastMessage">Yesterday i was there, at the restaurant!</p>
                                
                                <div className="col-3 UnreadMessage ms-auto me-3 p-0">
                                    <p className="text-white text-center">1</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </li>
                <li className="position-relative">
                    <article className="d-flex align-items-center h-100 ms-1">
                        <figure className="h-100 position-relative">
                            <img className="ProfileImageSize rounded-circle" src={EmptyFemale} alt="" />
                            <div className="ProfileStatusGreen rounded-circle"></div>
                        </figure>

                        <div className="container-fluid pe-0">
                            <div className="row">
                                <p className="col-10 ps-0 mb-0 text-black fw-bold fs-6">Skylar Salazar</p>
                                <p className="col-2 ps-0 mb-0 text-black fs-6 text-end pe-3">5m</p>
                                <p className="col-9 ps-0 mt-1 text-muted LastMessage">Yesterday i was there, at the restaurant!</p>
                                
                                <div className="col-3 UnreadMessage ms-auto me-3 p-0">
                                    <p className="text-white text-center">1</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </li>
                <li className="position-relative">
                    <article className="d-flex align-items-center h-100 ms-1">
                        <figure className="h-100 position-relative">
                            <img className="ProfileImageSize rounded-circle" src={EmptyFemale} alt="" />
                            <div className="ProfileStatusGreen rounded-circle"></div>
                        </figure>

                        <div className="container-fluid pe-0">
                            <div className="row">
                                <p className="col-10 ps-0 mb-0 text-black fw-bold fs-6">Skylar Salazar</p>
                                <p className="col-2 ps-0 mb-0 text-black fs-6 text-end pe-3">5m</p>
                                <p className="col-9 ps-0 mt-1 text-muted LastMessage">Yesterday i was there, at the restaurant!</p>
                                
                                <div className="col-3 UnreadMessage ms-auto me-3 p-0">
                                    <p className="text-white text-center">1</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </li>
                <li className="position-relative">
                    <article className="d-flex align-items-center h-100 ms-1">
                        <figure className="h-100 position-relative">
                            <img className="ProfileImageSize rounded-circle" src={EmptyFemale} alt="" />
                            <div className="ProfileStatusGreen rounded-circle"></div>
                        </figure>

                        <div className="container-fluid pe-0">
                            <div className="row">
                                <p className="col-10 ps-0 mb-0 text-black fw-bold fs-6">Skylar Salazar</p>
                                <p className="col-2 ps-0 mb-0 text-black fs-6 text-end pe-3">5m</p>
                                <p className="col-9 ps-0 mt-1 text-muted LastMessage">Yesterday i was there, at the restaurant!</p>
                                
                                <div className="col-3 UnreadMessage ms-auto me-3 p-0">
                                    <p className="text-white text-center">1</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </li>

                <li className="position-relative">
                    <article className="d-flex align-items-center h-100 ms-1">
                        <figure className="h-100 position-relative">
                            <img className="ProfileImageSize rounded-circle" src={EmptyFemale} alt="" />
                            <div className="ProfileStatusGreen rounded-circle"></div>
                        </figure>

                        <div className="container-fluid pe-0">
                            <div className="row">
                                <p className="col-10 ps-0 mb-0 text-black fw-bold fs-6">Skylar Salazar</p>
                                <p className="col-2 ps-0 mb-0 text-black fs-6 text-end pe-3">5m</p>
                                <p className="col-9 ps-0 mt-1 text-muted LastMessage">Yesterday i was there, at the restaurant!</p>
                                
                                <div className="col-3 UnreadMessage ms-auto me-3 p-0">
                                    <p className="text-white text-center">1</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </li>

                <li className="position-relative">
                    <article className="d-flex align-items-center h-100 ms-1">
                        <figure className="h-100 position-relative">
                            <img className="ProfileImageSize rounded-circle" src={EmptyFemale} alt="" />
                            <div className="ProfileStatusGreen rounded-circle"></div>
                        </figure>

                        <div className="container-fluid pe-0">
                            <div className="row">
                                <p className="col-10 ps-0 mb-0 text-black fw-bold fs-6">Skylar Salazar</p>
                                <p className="col-2 ps-0 mb-0 text-black fs-6 text-end pe-3">5m</p>
                                <p className="col-9 ps-0 mt-1 text-muted LastMessage">Yesterday i was there, at the restaurant!</p>
                                
                                <div className="col-3 UnreadMessage ms-auto me-3 p-0">
                                    <p className="text-white text-center">1</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </li>

                <li className="position-relative">
                    <article className="d-flex align-items-center h-100 ms-1">
                        <figure className="h-100 position-relative">
                            <img className="ProfileImageSize rounded-circle" src={EmptyFemale} alt="" />
                            <div className="ProfileStatusGreen rounded-circle"></div>
                        </figure>

                        <div className="container-fluid pe-0">
                            <div className="row">
                                <p className="col-10 ps-0 mb-0 text-black fw-bold fs-6">Skylar Salazar</p>
                                <p className="col-2 ps-0 mb-0 text-black fs-6 text-end pe-3">5m</p>
                                <p className="col-9 ps-0 mt-1 text-muted LastMessage">Yesterday i was there, at the restaurant!</p>
                                
                                <div className="col-3 UnreadMessage ms-auto me-3 p-0">
                                    <p className="text-white text-center">1</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </li>
            </ul>
        </section>
    );
}