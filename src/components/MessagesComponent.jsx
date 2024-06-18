import React, { useEffect, useState, useRef, useMemo } from "react";
import "../Scss/MessagesComponent.scss";
import { useLocation } from "react-router-dom";
import { saveMessage, getAllMessages } from "../API/FirestoreAPI";
import { getCurrentTimeStamp } from "../helpers/useMoment";
import { ImAttachment } from "react-icons/im";
import MessageFileUpload from "./common/MessageFileUpload";
import { getUniqueID } from "../helpers/getUniqueID";

export default function MessagesComponent({ currentUser }) {
    const location = useLocation();
    const messengerId = location.state?.messengerId;
    const messengerEmail = location.state?.messengerEmail;

    const [message, setMessage] = useState("");

    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const messagesListRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [progress, setProgress] = useState(0);

    const getMessage = (event) => {
        setMessage(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && message.trim() !== "") {
            uploadMessage();
        }
    };

    const uploadMessage = () => {
        saveMessage(
            currentUser?.userid,
            currentUser?.name,
            messengerId,
            getCurrentTimeStamp("LL LTS"),
            message,
            fileUrl
        );

        setMessage("");
        setFile(null);
        setFileUrl("");
    };

    useEffect(() => {
        if (messengerId?.length > 0) {
            getAllMessages(currentUser?.userid, messengerId, setAllMessages);
        }
    }, [currentUser?.userid, messengerId]);

    useEffect(() => {
        const messagesList = messagesListRef.current;
        if (messagesList) {
            messagesList.scrollTop = messagesList.scrollHeight;
        }
    }, [allMessages]);

    const orderedMessages = useMemo(() => {
        return allMessages
            .slice()
            .sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
    }, [allMessages]);

    // console.log(orderedMessages);

    return (
        <div className="messages-component-container">
            <div className="messages-list" ref={messagesListRef}>
                {orderedMessages.map((message, index) => (
                    <div
                        className={
                            message.senderId === currentUser?.userid
                                ? "message-preview"
                                : "message-preview left"
                        }
                        key={index}
                    >
                        <div className="message-header">
                            {/* <p className="message-sender">
                                {message.senderName}
                            </p> */}
                            <p className="message-timestamp">
                                {message.timeStamp}
                            </p>
                        </div>

                        {message.message && (
                            <p className="message-text">{message.message}</p>
                        )}
                        {message.fileUrl && (
                            <div className="message-file">
                                <a
                                    href={message.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Linked File
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {(messengerId?.length > 0 || fileUrl?.length > 0) && (
                <div className="message-input-container">
                    <input
                        onChange={getMessage}
                        onKeyDown={handleKeyDown}
                        name="Message"
                        placeholder="Type a message..."
                        className="Message-input"
                        value={message}
                    />
                    <ImAttachment
                        className="Message-attachment"
                        onClick={() => setModalOpen(true)}
                    />

                    <button
                        className="Message-btn"
                        onClick={uploadMessage}
                        type="button"
                        disabled={!message.trim() && !fileUrl}
                    >
                        {fileUrl
                            ? message.trim()
                                ? "Send"
                                : "Send only file"
                            : "Send"}
                    </button>

                    <MessageFileUpload
                        modalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                        progress={progress}
                        setProgress={setProgress}
                        setFile={setFile}
                        file={file}
                        fileUrl={fileUrl}
                        setFileUrl={setFileUrl}
                    />
                </div>
            )}
        </div>
    );
}
