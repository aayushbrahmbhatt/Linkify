import React, { useState } from "react";
import "./index.scss";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
// import SearchResultsLayout from '../../../Layout/SearchResultsLayout';

export default function Search({ setIsSearch, setSearchInput, searchInput }) {
    const navigate = useNavigate();

    const handleKeyPress = (event) => {
        if (event.key == "Enter") {
            setSearchInput("");
            setIsSearch(false);
            navigate("/SearchResultsLayout", {
                state: { searchInput: searchInput },
            });
        }
    };
    return (
        <div className="search-main">
            <input
                placeholder="Search"
                onKeyUp={handleKeyPress}
                // onKeyPress={handleKeyPress}
                onChange={(event) => setSearchInput(event.target.value)}
            />
            <IoIosClose
                className="close-icon"
                size={20}
                onClick={() => {
                    setIsSearch(false);
                    setSearchInput("");
                }}
            />
        </div>
    );
}
