import React, { useEffect, useState } from "react";
import { Button, Modal, Progress } from "antd";
import "./index.scss";
import { useLocation } from "react-router-dom";
import usericon from "../../../assets/user-icon.png";

export default function ProfileUploadModal({
    modalOpen,
    setModalOpen,
    getImage,
    uploadImage,
    deleteImage,
    currentImage,
    progress,
    currentUser,
    currentProfile,
}) {
    let location = useLocation();
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

    useEffect(() => {
        if (currentImage?.name) {
            setUploadedImageUrl(URL.createObjectURL(currentImage));
        }
    }, [currentImage]);

    const handleCloseModal = () => {
        setUploadedImageUrl(null);
        setModalOpen(false);
    };

    const renderFooter = () => {
        if (location?.state?.id === currentUser.userid) {
            return (
                <>
                    <Button
                        disabled={!currentImage?.name}
                        key="submit"
                        type="primary"
                        onClick={uploadImage}
                    >
                        Upload Profile Picture
                    </Button>
                    {currentUser && currentUser.imageLink && (
                        <Button
                            key="delete"
                            onClick={deleteCurrentProfileImage}
                        >
                            Delete Profile Picture
                        </Button>
                    )}
                </>
            );
        }
        return null;
    };

    const profileImageSrc =
        uploadedImageUrl ||
        currentProfile?.imageLink ||
        currentUser?.imageLink ||
        usericon;

    const deleteCurrentProfileImage = () => {
        deleteImage(currentUser.imageLink);
        setUploadedImageUrl(null);
        setModalOpen(false);
    };

    const handleImageChange = (event) => {
        const imageFile = event.target.files[0];
        if (imageFile) {
            getImage(event);
        }
    };

    return (
        <Modal
            title="Profile Image"
            centered
            visible={modalOpen}
            onCancel={handleCloseModal}
            footer={renderFooter()}
        >
            <div className="user-profile-pic">
                <img
                    className="post-image"
                    src={profileImageSrc}
                    alt="no-image-available"
                />
            </div>
            {location?.state?.id === currentUser.userid && (
                <div className="image-upload-main">
                    {/* <p>{currentImage.name}</p> */}
                    <label
                        className="upload-btn"
                        htmlFor="image-upload"
                        style={{ backgroundColor: "blue" }}
                    >
                        Add an Image
                    </label>
                    {progress !== 0 && (
                        <div className="progress-bar">
                            <Progress type="circle" percent={progress} />
                        </div>
                    )}
                    <input
                        hidden
                        id="image-upload"
                        type="file"
                        onChange={handleImageChange}
                    />
                </div>
            )}
        </Modal>
    );
}
