import React, { useMemo, useState, useEffect } from "react";
import "./index.scss";
import { Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { BsPencil, BsTrash } from "react-icons/bs";
import {
    getCurrentUser,
    getAllUsers,
    deletePost,
    getConnections,
} from "../../../API/FirestoreAPI";
import LikeButton from "../LikeButton";
import dummyuser from "../../../assets/dummy-image.png";

export default function PostsCard({ posts, id, getEditData }) {
    let navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [imageModal, setImageModal] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
        useState(false);

    useMemo(() => {
        getCurrentUser(setCurrentUser);
        getAllUsers(setAllUsers);
    }, []);

    useEffect(() => {
        getConnections(currentUser?.userid, posts?.userID, setIsConnected);
    }, [currentUser?.userid, posts?.userID]);

    return isConnected || currentUser?.userid === posts?.userID ? (
        <div className="posts-card" key={id}>
            <div className="post-header">
                <img
                    src={
                        allUsers
                            .filter((item) => item.id === posts?.userID)
                            .map((item) => item.imageLink)[0] || dummyuser
                    }
                    alt="profile image"
                    style={{ color: "black", fontSize: "11px" }}
                    className="user-profile"
                    onClick={() =>
                        navigate("/profile", {
                            state: {
                                id: posts?.userID,
                                email: posts?.userEmail,
                            },
                        })
                    }
                />

                <div className="name-timestamp">
                    <p
                        className="name"
                        onClick={() =>
                            navigate("/profile", {
                                state: {
                                    id: posts?.userID,
                                    email: posts?.userEmail,
                                },
                            })
                        }
                    >
                        {
                            allUsers.filter(
                                (user) => user.id === posts?.userID
                            )[0]?.name
                        }
                    </p>
                    <p className="headline">
                        {
                            allUsers.filter(
                                (user) => user.id === posts?.userID
                            )[0]?.headline
                        }
                    </p>
                    <p className="timeStamp"> {posts?.timeStamp}</p>
                </div>

                {currentUser?.userid === posts?.userID ? (
                    <div className="action-container">
                        <BsPencil
                            size={20}
                            className="action-icon"
                            onClick={() => getEditData(posts)}
                        />
                        <BsTrash
                            size={20}
                            className="action-icon"
                            onClick={() => setDeleteConfirmationVisible(true)}
                        />
                    </div>
                ) : null}
            </div>
            {/* <p className='status'>{posts.status}</p> */}
            <div
                className="status"
                dangerouslySetInnerHTML={{ __html: posts?.status }}
            ></div>

            {posts?.postImage ? (
                <img
                    src={posts?.postImage}
                    onClick={() => setImageModal(true)}
                    alt="post-image"
                    className="post-image"
                />
            ) : null}
            <LikeButton
                userId={currentUser?.userid}
                postId={posts?.id}
                currentUser={currentUser}
            />
            <Modal
                centered
                visible={deleteConfirmationVisible}
                onCancel={() => setDeleteConfirmationVisible(false)}
                onOk={() => {
                    deletePost(posts?.id);
                    setDeleteConfirmationVisible(false);
                }}
            >
                <p>Are you sure you want to delete this post?</p>
            </Modal>
            <Modal
                centered
                open={imageModal}
                onCancel={() => setImageModal(false)}
                footer={[]}
            >
                <img
                    src={posts?.postImage}
                    alt="post-modal-image"
                    style={{ color: "black", fontSize: "11px" }}
                    className="post-modal-image"
                />
            </Modal>
        </div>
    ) : null;
}
