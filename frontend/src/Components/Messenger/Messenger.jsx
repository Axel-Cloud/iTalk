import React, { useEffect } from 'react'
import { motion } from "framer-motion";
import ScreenDimensions from "../../Others/useScreenDimensions";
import { io } from "socket.io-client";

/* Redux */
import { useSelector } from "react-redux";

/* Components */
import AsideMenu from './AsideMenu';
import Chat from "./Chat";

export default function Messenger(){
    const { ScreenWidth } = ScreenDimensions();
    const isSelectedConversationRedux = useSelector(state => state.SelectedConversation.isSelected);
    const ApiURL = useSelector(state => state.ApiURL.URL);
    const Socket = io(ApiURL);

    useEffect(() => {
        Socket.connect();
        
        return () => {
            Socket.disconnect();
        }
        // eslint-disable-next-line
    }, []);

    const MessengerVariants = {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        }
    };

    const MessengerTransition = {
        duration: 0.5
    };

    return(
        <motion.div initial="initial" animate="animate" exit="exit" variants={MessengerVariants} transition={MessengerTransition}>
            <div className="w-100 d-flex Messenger">
                {
                    ScreenWidth >= 880 ?
                    <>
                        <AsideMenu Socket={ Socket } />
                        <Chat Socket={ Socket } />
                    </>
                    :
                    !isSelectedConversationRedux ?
                    <AsideMenu Socket={ Socket }/>
                    :
                    <Chat Socket={ Socket }/>
                }
            </div>
        </motion.div>
    );
}