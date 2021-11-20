import React, { useState } from 'react'
import { motion } from "framer-motion";

/* Components */
import AsideMenu from './AsideMenu';
import Chat from "./Chat";

export default function Messenger(){
    const [SelectedMenu, setSelectedMenu] = useState("Conversations");

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
            <div className="container-fluid Messenger">
                <div className="row">
                    <section className="col-4 p-0">
                        <AsideMenu SelectedMenu={SelectedMenu}/>
                    </section>
                    <section className="col-8 p-0">
                        <Chat/>
                    </section>
                </div>
            </div>
        </motion.div>
    );
}