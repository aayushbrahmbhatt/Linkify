import React, { useState, useEffect, useRef } from "react";
import "./index.scss";
import ConnectLogo from "../../../assets/ConnectLogo.png";
import Search from "../Search";
import usericon from "../../../assets/user-icon.png";
import { IoMdHome, IoIosBriefcase, IoMdNotifications } from "react-icons/io";
import { FaUserPlus, FaSearch, FaComments, FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../../API/FirestoreAPI";
import ProfilePopup from "../ProfilePopup";

export default function Navbar({ currentUser }) {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [activeIcon, setActiveIcon] = useState("");
    const userLogoRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        getAllUsers(setUsers);
    }, []);

    useEffect(() => {
        let debounced = setTimeout(() => {
            handleSearch();
        }, 1000);
        return () => clearTimeout(debounced);
    }, [searchInput]);

    const handleSearch = () => {
        if (searchInput !== "") {
            let searched = users.filter((user) => {
                return Object.values(user)
                    .join("")
                    .toLowerCase()
                    .includes(searchInput.toLowerCase());
            });
            setFilteredUsers(searched);
        } else {
            setFilteredUsers(users);
        }
    };

    const openUser = (user) => {
        navigate("/profile", {
            state: {
                id: user?.id,
                email: user.email,
            },
        });
        setSearchInput("");
        window.location.reload();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setSearchInput("");
                setIsSearch(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                userLogoRef.current &&
                !userLogoRef.current.contains(event.target)
            ) {
                setShowPopup(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const pathname = window.location.pathname;
        switch (pathname) {
            case "/Home":
                setActiveIcon("Home");
                break;
            case "/Connections":
                setActiveIcon("connections");
                break;
            case "/Messages":
                setActiveIcon("messages");
                break;
            case "/ResumeBuilder":
                setActiveIcon("resumeBuilder");
                break;
            default:
                setActiveIcon("");
                break;
        }
    }, [window.location.pathname]);

    return (
        <div className="navbar-master">
            <img
                className="connect-logo"
                src={ConnectLogo}
                alt="Connect Logo"
                onClick={() => navigate("/Home")}
                title="Home"
            />
            {isSearch ? (
                <Search
                    setIsSearch={setIsSearch}
                    setSearchInput={setSearchInput}
                    searchInput={searchInput}
                />
            ) : (
                <div className="icons">
                    <IoMdHome
                        size={40}
                        className={
                            activeIcon === "Home"
                                ? "icon-scss active"
                                : "icon-scss"
                        }
                        onClick={() => navigate("/Home")}
                        title="Home"
                    />
                    <FaSearch
                        size={30}
                        className={
                            activeIcon === "search"
                                ? "icon-scss active"
                                : "icon-scss"
                        }
                        onClick={() => setIsSearch(true)}
                        title="Search"
                    />
                    <FaUserPlus
                        size={30}
                        className={
                            activeIcon === "connections"
                                ? "icon-scss active"
                                : "icon-scss"
                        }
                        onClick={() => navigate("/Connections")}
                        title="Connection Page"
                    />
                    <FaComments
                        size={30}
                        className={
                            activeIcon === "messages"
                                ? "icon-scss active"
                                : "icon-scss"
                        }
                        onClick={() => navigate("/Messages")}
                        title="Message"
                    />
                    <FaFileAlt
                        size={30}
                        className={
                            activeIcon === "resumeBuilder"
                                ? "icon-scss active"
                                : "icon-scss"
                        }
                        onClick={() => navigate("/ResumeBuilder")}
                        title="Resume Builder"
                    />
                </div>
            )}
            <div ref={userLogoRef} onClick={() => setShowPopup(!showPopup)}>
                <img
                    className="user-logo"
                    src={currentUser?.imageLink || usericon}
                    alt="User Icon"
                    title="Profile"
                />
                {showPopup && <ProfilePopup currentUser={currentUser} />}
            </div>

            {searchInput.length === 0 ? (
                <></>
            ) : (
                <div ref={menuRef} className="search-results">
                    {filteredUsers.length === 0 ? (
                        <div className="search-inner">No results</div>
                    ) : (
                        filteredUsers.map((user) => (
                            <div
                                className="search-inner"
                                onClick={() => openUser(user)}
                            >
                                <img
                                    src={user?.imageLink || usericon}
                                    alt={user.name}
                                />
                                <p className="name">{user?.name}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
