import React, { useEffect, useState } from "react";
import { Button, Modal, Progress } from "antd";
import "./index.scss";
import usericon from "../../../assets/user-icon.png";
import { useNavigate } from "react-router-dom";
import { removeConnection } from "../../../API/FirestoreAPI";

export default function FollowingModal({
    currentUser,
    showFollowing,
    setShowFollowing,
    following,
}) {
    // console.log(following);

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

        if (event.target.classList.contains("unfollow-btn")) {
            removeConnection(currentUser?.userid, user.id);
            // const updatedFollowers = followers.filter(user => user.id !== id);
            // setFollowers(updatedFollowers);
        } else {
            openUser(user);
            setShowFollowing(false);
        }
    };

    return (
        <Modal
            title="People whom you follow"
            open={showFollowing}
            onCancel={() => setShowFollowing(false)}
            footer={null}
        >
            <div className="following-results">
                {following.length === 0 ? (
                    <div className="following-inner">No results</div>
                ) : (
                    following.map((user) => (
                        <div
                            className="following-inner"
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
                            <button className="unfollow-btn"> Unfollow</button>
                        </div>
                    ))
                )}
            </div>
        </Modal>
    );
}
