import React, { useState, useEffect } from 'react'
import { SelectedConversation } from "../../Store/SelectedConversation/action";
import { AsideStatus } from "../../Store/AsideMenuStatus/action";
import { useDispatch } from 'react-redux';

//Icons
import { ReactComponent as OpenChat } from '../../Assets/icons/OpenChat.svg';

export default function Search(props){
    const [Data, setData] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        setData(props.Data);
    }, [props]);

    const ChangeConversation = (User) => {
        User.isSelected = true;
        dispatch(SelectedConversation(User));
        dispatch(AsideStatus("Conversation"));
    }

    return (
        <section className="Search">
            <p className="fw-bold fs-5 text-center mb-2">Search Result</p>

            <ul className="list-group">
                {
                    Data.map((User) => {
                        return (
                            <li key={User._id} className="list-group-item d-flex justify-content-between align-items-center">
                                <article className="d-flex align-items-center h-100 w-100 ms-1">
                                    <figure className="h-100 position-relative VerticalFigure">
                                        <img className="ProfileImageSize rounded-circle" src={`data:image/png;base64,${User.ProfileImage}`} alt="" />
                                        <div className={`${User.Online ? "ProfileStatusGreen" : "ProfileStatusRed"} rounded-circle`}></div>
                                    </figure>

                                    <p className="ps-0 mb-0 ms-3 fw-bold fs-6" onClick={() => ChangeConversation(User)}>{`${User.Name} ${User.Lastname}`}</p>

                                    <button className="d-block h-100 border-0 ms-auto" onClick={() => ChangeConversation(User)}>
                                        <OpenChat className="OpenChat"/>
                                    </button>
                                </article>
                            </li>
                        )
                    })    
                }
            </ul>
        </section>
    )
}