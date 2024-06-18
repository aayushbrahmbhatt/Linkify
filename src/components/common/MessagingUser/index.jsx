import React, { useState, useEffect } from "react";
import { getConnections } from "../../../API/FirestoreAPI";
import { useLocation } from "react-router-dom";
import usericon from "../../../assets/dummy-image.png";
import { useNavigate } from "react-router-dom";

export default function MessagingUser({ user, getCurrentUser, currentUser }) {
    const [isConnected, setIsConnected] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const messengerId = location.state?.messengerId;

    useEffect(() => {
        getConnections(currentUser.userid, user.id, setIsConnected);
    }, [currentUser.userid, user.id]);

    const handleClick = () => {
        navigate("/messages", {
            state: { messengerId: user.id, messengerEmail: user.email },
        });
    };

    return isConnected ? (
        <div
            className={
                user.id === messengerId
                    ? "messaging-user active"
                    : "messaging-user"
            }
            onClick={handleClick}
        >
            <img
                src={user.imageLink || usericon}
                alt={user.name}
                style={{ color: "black" }}
            />
            <div className="user-details">
                <p className="name">{user.name}</p>
            </div>
        </div>
    ) : null;
}
