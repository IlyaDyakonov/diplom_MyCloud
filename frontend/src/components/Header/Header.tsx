import React from "react";
import './Header.css';


const Header:React.FC = () => {
    const prefix = import.meta.env.BUILD_PREFIX || '';
    return (
        <div className="header">
            <header className="header-component">
                <div className="header-name">
                    <h1>Облачное хранилище «MyCloud!»</h1>
                </div>
                <img src={`${prefix}MyCloud.png`} alt="My Cloud" className="logo-img"></img>
            </header>
        </div>
    )
};

export default Header;