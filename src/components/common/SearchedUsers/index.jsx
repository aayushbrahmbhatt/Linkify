import React, { useState, useEffect } from "react";
import "./index.scss";
import usericon from "../../../assets/dummy-image.png";
import { getConnections } from "../../../API/FirestoreAPI";
import { useNavigate } from "react-router-dom";

export default function SearchedUsers({
    user,
    getCurrentUser,
    currentUser,
    removeCurrentUser,
}) {
    let navigate = useNavigate();

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

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        getConnections(currentUser.userid, user.id, setIsConnected);
    }, [currentUser.userid, user.id]);

    return (
        <div className="searched-user" onClick={handleClick}>
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
                        Unfollow
                    </button>
                    <button className="message-button">Message</button>
                </>
            )}
        </div>
    );
}
