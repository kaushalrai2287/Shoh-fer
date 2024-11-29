import React from 'react'
import Image from "next/image";

const Header = () => {
    return (
        <header>
            <div className="header_mainbox">
                <div className="header_logo">
                    <img src="/images/dummy-logo.png" alt="Logo" className="img-fluid" />
                </div>
                <div className="header_menu">
                    <img src="/images/header-button.svg" alt="" className="img-fluid" />
                </div>
            </div>
        </header>
    )
}

export default Header