import React from "react";
import './Footer.css';
import { NavLink } from "react-router-dom";


const Footer:React.FC = () => {

    return (
        <div className="footer">
            <footer className="footer-component">
                <div className="footer-name">
                    © 2024 Илья Inc.
                </div>
                <p><NavLink to="/" className="footer-home-link">Главная страница</NavLink></p>
                <ul className="footer-link">
                    <li className="item-tg">
                        <a href="https://t.me/theApuoX" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-telegram"></i>
                        </a>
                    </li>
                    <li className="item-github">
                        <a href="https://github.com/IlyaDyakonov" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-github"></i>
                        </a>
                    </li>
                </ul>
            </footer>
        </div>
    )
};

export default Footer;