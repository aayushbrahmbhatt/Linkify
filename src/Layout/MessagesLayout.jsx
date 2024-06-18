import React, { useMemo } from "react";
import Navbar from "../components/common/Navbar";
import { getCurrentUser } from "../API/FirestoreAPI";
import Messengers from "../WebPages/Messengers";
import Messages from "../WebPages/Messages";
import "../Scss/MessagesLayout.scss";

export default function MessagesLayout() {
    const [currentUser, setCurrentUser] = React.useState({});
    useMemo(() => {
        getCurrentUser(setCurrentUser);
    }, []);
    return (
        <div>
            <Navbar currentUser={currentUser} />
            <div className="messages-layout">
                <div className="MessengersComponent">
                    <Messengers currentUser={currentUser} />
                </div>
                <div className="MessagesComponent">
                    <Messages currentUser={currentUser} />
                </div>
            </div>
        </div>
    );
}
