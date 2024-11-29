"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
    const [isToggled_new, setIsToggled_new] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null); // Explicitly type the ref

    const toggleMenu = () => {
        setIsToggled_new((prev) => !prev);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsToggled_new(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header>
            <div className="header_mainbox">
                <div className="header_logo">
                    <img src="/images/dummy-logo.png" alt="Logo" className="img-fluid" />
                </div>
                <div
                    className={`header_menu ${isToggled_new ? "header_toggle" : ""}`}
                    onClick={toggleMenu}
                    ref={menuRef} // Attach ref to track clicks outside
                >
                    <img src="/images/header-button.svg" alt="" className="img-fluid" />
                    <div className="sidemunu_submenu_listing header_submenu_listing">
                        <ul>
                            <li><Link href="">Edit Profile</Link></li>
                            <li><Link href="">Change Password</Link></li>
                            <li><Link href="">Log Out</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
