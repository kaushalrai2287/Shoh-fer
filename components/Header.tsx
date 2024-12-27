// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { logout } from "@/app/dashboard/action";

// const Header = () => {
//     const [isToggled_new, setIsToggled_new] = useState(false);
//     const menuRef = useRef<HTMLDivElement | null>(null); // Explicitly type the ref

//     const toggleMenu = () => {
//         setIsToggled_new((prev) => !prev);
//     };

//     // Close menu when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//                 setIsToggled_new(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     return (
//         <header>
//             <div className="header_mainbox">
//                 <div className="header_logo">
//                     <img src="/images/dummy-logo.png" alt="Logo" className="img-fluid" />
//                 </div>
//                 <div
//                     className={`header_menu ${isToggled_new ? "header_toggle" : ""}`}
//                     onClick={toggleMenu}
//                     ref={menuRef} // Attach ref to track clicks outside
//                 >
//                     <img src="/images/header-button.svg" alt="" className="img-fluid" />
            //         <div className="sidemunu_submenu_listing header_submenu_listing">
            //             <ul>
            //                 <li><Link href="">Edit Profile</Link></li>
            //                 <li><Link href="">Change Password</Link></li>
            //                 {/* <li><Link href="">Log Out</Link></li> */}
            //                 <li>
            //     <button onClick={logout}>Logout</button>
            // </li>
            //             </ul>
            //         </div>
//                 </div>
//             </div>
//         </header>
//     );
// };

// export default Header;
"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { logout } from "@/app/dashboard/action";
import { createClient } from "../utils/supabase/client";  
import { FaUserCircle } from 'react-icons/fa';  // Importing user profile icon from React Icons

const Header = () => {
    const [isToggled_new, setIsToggled_new] = useState(false);
    const [userName, setUserName] = useState<string | null>(null); 
    const menuRef = useRef<HTMLDivElement | null>(null); 

    const supabase = createClient();

    const toggleMenu = () => {
        setIsToggled_new((prev) => !prev);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const {
                    data: { user },
                    error,
                } = await supabase.auth.getUser();

                if (error) {
                    console.error("Error fetching user:", error.message);
                    return;
                }

                if (user) {
                    // Query custom users table to fetch user name
                    const { data, error: dbError } = await supabase
                        .from("users")
                        .select("name") 
                        .eq("auth_id", user.id)
                        .single();

                    if (dbError) {
                        console.error("Error fetching user from custom table:", dbError.message);
                        setUserName("User");
                    } else {
                        setUserName(data?.name || "User"); 
                    }
                } else {
                    setUserName(null);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            }
        };

        fetchUser();
    }, [supabase]);

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
                    ref={menuRef}
                >
                  
                  <FaUserCircle size={35} style={{ marginRight: '8px' }} /> 
                  <span>{userName}</span>
                    <div className="sidemunu_submenu_listing header_submenu_listing">
                   <ul>
                      <li><Link href="">Edit Profile</Link></li>
                           <li><Link href="">Change Password</Link></li>
                       {/* <li><Link href="">Log Out</Link></li> */}
                       <li>
              <button onClick={logout}>Logout</button>
            </li>
                </ul>
              </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
