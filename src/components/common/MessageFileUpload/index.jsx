import React, { useState, useEffect } from "react";
import { Button, Modal, Progress } from "antd";
import "./index.scss";
import { uploadMessageFile } from "../../../API/ImageUpload";
import { getUniqueID } from "../../../helpers/getUniqueID";
import { toast } from "react-toastify";
import { deleteFile } from "../../../API/ImageUpload";

export default function MessageFileUploadModal({
    MessageID,
    setMessageID,
    modalOpen,
    setModalOpen,
    progress,
    setProgress,
    file,
    fileUrl,
    setFile,
    setFileUrl,
}) {
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileUpload = (event) => {
        setFile(event.target.files[0]);
    };

    const uploadFile = () => {
        if (file) {
            try {
                uploadMessageFile(file, setFileUrl, setUploadProgress);
                setModalOpen(false);
            } catch (error) {
                console.error("Error uploading file", error);
                toast.error("An error occurred while uploading the file");
            }
        }
    };

    const handleFileRemoval = () => {
        // setModalOpen(false);
        if (fileUrl) {
            deleteFile(fileUrl);
        }

        setFileUrl("");
        setProgress(0);
        setFile(null);
    };

    const renderFooter = () => {
        return (
            <>
                <Button
                    disabled={!fileUrl && !file}
                    onClick={handleFileRemoval}
                >
                    Remove File
                </Button>
                <Button disabled={fileUrl || !file} onClick={uploadFile}>
                    Upload File
                </Button>
            </>
        );
    };

    return (
        <>
            <Modal
                title="Upload file"
                centered
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false);
                }}
                footer={renderFooter()}
            >
                <label htmlFor="file-upload" className="file-input-label">
                    {file ? "Change file" : "Select a file"}
                </label>
                <input
                    id="file-upload"
                    hidden
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.png,jpeg,.jpg,.gif,.mp3,.mp4,.avi,.mkv,.mov,.mpg,.mpeg,.webm"
                />
                {file && (
                    <div className="file-info">
                        <p>{file.name}</p>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="progress-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                                <p className="progress-percentage">
                                    {uploadProgress}%
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
}
