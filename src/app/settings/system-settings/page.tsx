"use client";

import React, { useEffect, useState } from "react";
import Header from "../../../../components/Header";
import Sidemenu from "../../../../components/Sidemenu";
import { createClient } from "../../../../utils/supabase/client";
import { redirect } from "next/navigation";

const supabase = createClient();

interface FormDataType {
  name: string;
  email: string;
  logo: File | null;
  favicon: File | null;
}

const SystemSetting = () => {
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        redirect("/login");
      }
    };
    fetchUser();
  }, []);

  const [isToggled, setIsToggled] = useState(false); // State for toggle
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    logo: null,
    favicon: null,
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null); 
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null); // State for favicon

  // Fetch the logo and favicon from the database
  useEffect(() => {
    const fetchSettings = async () => {
      const { data: latestSettings, error } = await supabase
        .from("system_settings")
        .select("logo_url, favicon_url")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching latest settings:", error.message);
      } else if (latestSettings && latestSettings.length > 0) {
        setLogoUrl(latestSettings[0].logo_url); // Set the initial logo URL
        setFaviconUrl(latestSettings[0].favicon_url); // Set the initial favicon URL
      }
    };
    fetchSettings();
  }, []);

  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });

      // If a logo is selected, create a URL for it
      if (name === "logo" && files[0]) {
        const fileUrl = URL.createObjectURL(files[0]);
        setLogoUrl(fileUrl); // Update the logo URL in the state
      }

      if (name === "favicon" && files[0]) {
        const fileUrl = URL.createObjectURL(files[0]);
        setFaviconUrl(fileUrl); // Update the favicon URL in the state
      }
    }
  };

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const { name, email, logo, favicon } = formData;

      // Upload Logo
      let logoUrl = null;
      if (logo) {
        const { data: logoData, error: logoError } = await supabase.storage
          .from("system_settings")
          .upload(`logos/${Date.now()}_${logo.name}`, logo);

        if (logoError) {
          console.error("Logo upload error:", logoError);
          throw new Error(logoError.message || "Error uploading logo");
        }

        logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/system_settings/${logoData.path}`;
      }

      // Upload Favicon
      let faviconUrl = null;
      if (favicon) {
        const { data: faviconData, error: faviconError } = await supabase.storage
          .from("system_settings")
          .upload(`favicons/${Date.now()}_${favicon.name}`, favicon);

        if (faviconError) {
          console.error("Favicon upload error:", faviconError);
          throw new Error(faviconError.message || "Error uploading favicon");
        }

        faviconUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/system_settings/${faviconData.path}`;
      }

      // Insert into Database
      const { data, error: dbError, status } = await supabase
        .from("system_settings")
        .insert([{ name, email, logo_url: logoUrl, favicon_url: faviconUrl }]);

      // Check for database insertion error
      if (dbError) {
        console.error("Database insertion error:", dbError.message);
        throw new Error(dbError.message || "Error saving system settings to database");
      }

      // Fetch the latest settings again to update the state
      const { data: latestSettings, error: fetchError } = await supabase
        .from("system_settings")
        .select("logo_url, favicon_url")
        .order("created_at", { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error("Error fetching latest settings:", fetchError.message);
        throw new Error(fetchError.message || "Error fetching latest settings");
      }

      if (latestSettings && latestSettings.length > 0) {
        setLogoUrl(latestSettings[0].logo_url); // Update the logo URL
        setFaviconUrl(latestSettings[0].favicon_url); // Update the favicon URL
      }

      alert("System settings saved successfully!");

    } catch (error: any) {
      console.error("Error saving system settings:", error);
      alert(`An error occurred: ${error.message || "Unknown error"}`);
    }
  };

  const toggleClass = () => {
    setIsToggled(!isToggled);
  };

  return (
    <main className="add_notification_service_center_main">
      <Header />
      <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
        <div className="inner_left">
          <Sidemenu onToggle={toggleClass} />
        </div>
        <div className="inner_right">
          <div className="add_service_formbox checkbox_formbox">
            <form onSubmit={handleSubmit}>
              <div className="service_form_heading">System Settings</div>

              {/* Logo Upload */}
              <div className="inner_form_group">
                <div className="setting_logos">
                  <img
                    src={logoUrl || "/images/dummy-logo.png"} // Show the uploaded logo or fallback to dummy logo
                    alt="Logo"
                    className="img-fluid"
                  />
                </div>
                <label htmlFor="logo">Upload Logo</label>
                <input
                  className="form-control"
                  type="file"
                  name="logo"
                  id="logo"
                  onChange={handleFileChange}
                />
              </div>

              {/* Favicon Upload */}
              <div className="inner_form_group">
                <div className="setting_logos">
                  <img
                    src={faviconUrl || "/images/dummy-favicon.png"} // Show the uploaded favicon or fallback to dummy favicon
                    alt="Favicon"
                    className="img-fluid"
                  />
                </div>
                <label htmlFor="favicon">Upload Favicon</label>
                <input
                  className="form-control"
                  type="file"
                  name="favicon"
                  id="favicon"
                  onChange={handleFileChange}
                />
              </div>

              {/* Name */}
              <div className="inner_form_group">
                <label htmlFor="name">Name</label>
                <input
                  className="form-control"
                  name="name"
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              {/* Email */}
              <div className="inner_form_group">
                <label htmlFor="email">Email</label>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Submit Buttons */}
              <div className="inner_form_group inner_form_group_submit">
                <input type="submit" className="submite_btn" value="Submit" />
                {/* <input type="reset" className="close_btn" value="Close" /> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SystemSetting;
