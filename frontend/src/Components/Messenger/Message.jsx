import React from 'react'

export default function Message(props) {
    

    return (
        <div className={`d-flex ${props.UserID === localStorage.getItem("User") ? "justify-content-end" : "justify-content-start"} w-100 mt-5 Message`}>
            <span className={`p-2 ps-3 pe-3 rounded-pill ${props.UserID === localStorage.getItem("User") ? "me-3" : ""}`}>{props.Message}</span>
        </div>
    )
}
