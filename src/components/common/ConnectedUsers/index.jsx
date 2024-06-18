import React, { useState, useEffect } from "react";
import { getConnections } from "../../../API/FirestoreAPI";
import usericon from "../../../assets/dummy-image.png";
import { useNavigate } from "react-router-dom";

export default function ConnectedUsers({
    user,
    getCurrentUser,
    currentUser,
    removeCurrentUser,
}) {
    let navigate = useNavigate();
    const [isConnected, setIsConnected] = useState(false);

    const handleClick = (event) => {
        event.preventDefault();

        if (
            event.target.classList.contains("connect-button") ||
            event.target.classList.contains("unfollow-button")
        ) {
        } else if (event.target.classList.contains("message-button")) {
            navigate("/messages", {
                state: { messengerId: user.id, messengerEmail: user.email },
            });
        } else {
            navigate("/profile", {
                state: { id: user.id, email: user.email },
            });
        }
    };

    useEffect(() => {
        getConnections(currentUser.userid, user.id, setIsConnected);
    }, [currentUser.userid, user.id]);

    return !isConnected ? (
        <div className="connected-user" onClick={handleClick}>
            <img
                src={user.imageLink || usericon}
                alt={user.name}
                style={{ color: "black" }}
            />
            <div className="user-details">
                <p className="name">{user.name}</p>
                <p className="headline">{user.headline}</p>
            </div>

            {!isConnected ? (
                <button
                    className="connect-button"
                    onClick={() => getCurrentUser(user.id)}
                >
                    Follow
                </button>
            ) : (
                <>
                    <button
                        className="unfollow-button"
                        onClick={() => removeCurrentUser(user.id)}
                    >
                        unfollow
                    </button>
                    <button className="message-button">Message</button>
                </>
            )}
        </div>
    ):
    <></>
    ;
}
