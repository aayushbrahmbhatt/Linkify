import React, { useEffect, useState } from "react";
import { Button, Modal, Progress } from "antd";
import "./index.scss";
import usericon from "../../../assets/user-icon.png";
import { useNavigate } from "react-router-dom";
import { removeConnection } from "../../../API/FirestoreAPI";

export default function FollowersModal({
    currentUser,
    showFollowers,
    setShowFollowers,
    followers,
}) {
    const navigate = useNavigate();

    const openUser = (user) => {
        navigate("/profile", {
            state: {
                id: user?.id,
                email: user?.email,
            },
        });
        window.location.reload();
    };

    const handleClick = (event, user) => {
        event.preventDefault();

        if (event.target.classList.contains("remove-btn")) {
            removeConnection(user.id, currentUser?.userid);
            // const updatedFollowers = followers.filter(user => user.id !== id);
            // setFollowers(updatedFollowers);
        } else {
            openUser(user);
            setShowFollowers(false);
        }
    };

    return (
        <Modal
            title="People who follow you"
            open={showFollowers}
            onCancel={() => setShowFollowers(false)}
            footer={null}
        >
            <div className="followers-results">
                {followers.length === 0 ? (
                    <div className="followers-inner">No results</div>
                ) : (
                    followers.map((user) => (
                        <div
                            className="followers-inner"
                            onClick={(event) => {
                                // console.log(user);
                                handleClick(event, user);
                            }}
                        >
                            <img
                                src={user?.imageLink || usericon}
                                alt={user.name}
                            />
                            <p className="name">{user?.name}</p>
                            <button className="remove-btn"> Remove</button>
                        </div>
                    ))
                )}
            </div>
        </Modal>
    );
}
