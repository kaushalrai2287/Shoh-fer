import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";

// Initialize supabase client
const supabase = createClient();

interface PermissionsContextType {
  permissions: string[];
  fetchPermissions: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  // Function to fetch permissions
  const fetchPermissions = async () => {
    try {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error || !sessionData?.session) return;

      const token = sessionData.session.access_token;
      const response = await fetch("/api/users/permission", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setPermissions(data.permissions || []);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  // Trigger permissions fetch whenever the login status changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchPermissions();
    }
  }, [isLoggedIn]);

  // Listen for changes in auth session (login state)
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);  // Set login state based on session
    });

    // Cleanup the auth listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <PermissionsContext.Provider value={{ permissions, fetchPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};
