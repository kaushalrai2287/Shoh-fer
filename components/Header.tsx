
// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { logout } from "@/app/dashboard/action";
// import { createClient } from "../utils/supabase/client";  
// import { FaUserCircle } from 'react-icons/fa';  // Importing user profile icon from React Icons

// const Header = () => {
//     const [isToggled_new, setIsToggled_new] = useState(false);
//     const [userName, setUserName] = useState<string | null>(null); 
//     const menuRef = useRef<HTMLDivElement | null>(null); 

//     const supabase = createClient();

//     const toggleMenu = () => {
//         setIsToggled_new((prev) => !prev);
//     };

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const {
//                     data: { user },
//                     error,
//                 } = await supabase.auth.getUser();

//                 if (error) {
//                     console.error("Error fetching user:", error.message);
//                     return;
//                 }

//                 if (user) {
//                     // Query custom users table to fetch user name
//                     const { data, error: dbError } = await supabase
//                         .from("users")
//                         .select("name") 
//                         .eq("auth_id", user.id)
//                         .single();

//                     if (dbError) {
//                         console.error("Error fetching user from custom table:", dbError.message);
//                         setUserName("User");
//                     } else {
//                         setUserName(data?.name || "User"); 
//                     }
//                 } else {
//                     setUserName(null);
//                 }
//             } catch (err) {
//                 console.error("Unexpected error:", err);
//             }
//         };

//         fetchUser();
//     }, [supabase]);

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
//                     ref={menuRef}
//                 >
                  
//                   <FaUserCircle size={35} style={{ marginRight: '8px' }} /> 
//                   <span>{userName}</span>
//                     <div className="sidemunu_submenu_listing header_submenu_listing">
//                    <ul>
//                       <li><Link href="">Edit Profile</Link></li>
//                            <li><Link href="">Change Password</Link></li>
//                        {/* <li><Link href="">Log Out</Link></li> */}
//                        <li>
//               <button onClick={logout}>Logout</button>
//             </li>
//                 </ul>
//               </div>
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
import { FaUserCircle } from "react-icons/fa"; 

const Header = () => {
  const [isToggledNew, setIsToggledNew] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null); 
  const menuRef = useRef<HTMLDivElement | null>(null);

  const supabase = createClient();

  const toggleMenu = () => {
    setIsToggledNew((prev) => !prev);
  };

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data, error } = await supabase
        .from("system_settings")
        .select("logo_url, created_at") 
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

        if (error) {
          console.error("Error fetching logo URL:", error.message);
          return;
        }

        if (data) {
          setLogoUrl(data.logo_url); 
        }
      } catch (err) {
        console.error("Unexpected error fetching logo:", err);
      }
    };

    fetchLogo();
  }, [supabase]);

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
        setIsToggledNew(false);
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
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="img-fluid" />
          ) : (
            <p>Loading...</p> 
          )}
        </div>
        <div
          className={`header_menu ${isToggledNew ? "header_toggle" : ""}`}
          onClick={toggleMenu}
          ref={menuRef}
        >
          <FaUserCircle size={35} style={{ marginRight: "8px" }} />
          <span>{userName}</span>
          <div className="sidemunu_submenu_listing header_submenu_listing">
            <ul>
              <li>
                <Link href="">Edit Profile</Link>
              </li>
              <li>
                <Link href="">Change Password</Link>
              </li>
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
