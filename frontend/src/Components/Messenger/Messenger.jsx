import React, { useState } from 'react'

/* Components */
import AsideMenu from './AsideMenu';

export default function Messenger(){
    const [SelectedMenu, setSelectedMenu] = useState("Conversations");

    return(
        <main>
            <div className="container-fluid Messenger">
                <div className="row">
                    <section className="col-4">
                        <AsideMenu SelectedMenu={SelectedMenu}/>
                    </section>
                </div>
            </div>
        </main>
    );
}