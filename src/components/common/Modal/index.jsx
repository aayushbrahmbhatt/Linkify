import React, { useState } from "react";
import ReactQuill from "react-quill";
import { Modal, Button, Progress, message } from "antd";
import { GrGallery } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import "./index.scss";

const ModalComponent = ({
    modalOpen,
    sendStatus,
    setModalOpen,
    setStatus,
    status,
    isEdit,
    updateStatus,
    uploadPostImage,
    postImage,
    setPostImage,
    currentPost,
    setCurrentPost,
}) => {
    const [progress, setProgress] = useState(0);

    const removeImage = () => {
        setPostImage("");
        setCurrentPost({ ...currentPost, postImage: "" });
        message.success("Image removed successfully!");
    };

    return (
        <Modal
            title="Create a Post"
            centered
            visible={modalOpen}
            onOk={() => {
                setStatus("");
                setModalOpen(false);
                setPostImage("");
                setCurrentPost({});
            }}
            onCancel={() => {
                setStatus("");
                setModalOpen(false);
                setPostImage("");
                setCurrentPost({});
            }}
            footer={[
                <Button
                    key="submit"
                    onClick={isEdit ? updateStatus : sendStatus}
                    type="primary"
                    disabled={status.length === 0}
                >
                    {isEdit ? "Update" : "Post"}
                </Button>,
            ]}
        >
            <div className="post-container">
                <div className="textarea-container">
                    <ReactQuill
                        className="modal-input"
                        placeholder="What is on your mind?"
                        theme="snow"
                        value={status}
                        onChange={setStatus}
                    />
                    {(postImage || currentPost.postImage) && (
                        <div className="image-container">
                            <button
                                className="remove-button"
                                onClick={removeImage}
                            >
                                <AiOutlineClose />
                            </button>
                            <img
                                src={postImage || currentPost.postImage}
                                alt="postImage"
                                className="preview-post-image"
                            />
                        </div>
                    )}
                    {progress > 0 && progress < 100 && (
                        <div className="progress-bar">
                            <Progress type="circle" percent={progress} />
                        </div>
                    )}
                    <label htmlFor="upload-pic" className="upload-label">
                        <GrGallery size={30} className="upload-pic" />
                    </label>
                    <input
                        id="upload-pic"
                        type="file"
                        hidden
                        onChange={(event) =>
                            uploadPostImage(
                                event.target.files[0],
                                setPostImage,
                                setProgress
                            )
                        }
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ModalComponent;
