"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import Header from "../../../../../components/Header";
import Sidemenu from "../../../../../components/Sidemenu";
import { DataTable } from "../../../../../components/ui/datatable";
import Link from "next/link";
import { createClient } from "../../../../../utils/supabase/client";
import { CSVLink } from "react-csv";
import HeadingBredcrum from "../../../../../components/HeadingBredcrum";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
type Driver = {
  driver_id: number;
  driver_name: string;
  phone_number: string;
  email: string | null;
  address: string;
  dob: string; // Date format as a string (e.g., 'YYYY-MM-DD')
  driving_license_no: string;
  license_category: string;
  experience_years: number;
  vehicle_type: string | null;
  language_spoken: string | null;
  rating: number; // Numeric (e.g., 3.5)
  profile_photo_url: string | null;
  driver_document: string | null;
  is_active: boolean;
  is_approved: boolean;
  Brand: string;
  vehicle_type_experience: string;
  emergency_contact_no: string;
  driver_national_id_image: string;
  isadminverified: string; // 'Approved' | 'Pending' | 'Rejected'
  kyc_status: string; // 'Approved' | 'Pending' | 'Rejected'
  police_verification_status: string; // 'Approved' | 'Pending' | 'Rejected'
};

const ManageDriver = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [driver, setDriver] = useState<Driver[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [contactNoQuery, setContactNoQuery] = useState("");

  const [filteredrivername, setFilteredDriver] = useState<Driver[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | "">("");
  const [requestFilter, setRequestFilter] = useState<string | "">("");

  const toggleClass = () => {
    setIsToggled(!isToggled);
  };
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("drivers").select("*");

        console.log(data);

        if (error) throw error;

        setDriver(data || []);
        setFilteredDriver(data || []); 
      } catch (err) {
        console.error("Error fetching service centers:", err);
      }
    };

    fetchDriver();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const filtered = driver.filter((center) => {
      const matchesName =
        center.driver_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false;

      const matchesContactNo =
        center.phone_number
          ?.toLowerCase()
          .includes(contactNoQuery.toLowerCase()) || false;

      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "Active" ? center.is_active : !center.is_active);
      const matchesRequest =
        requestFilter === "" ||
        (requestFilter === "Approved"
          ? center.is_approved
          : !center.is_approved);

      return matchesName && matchesContactNo && matchesStatus && matchesRequest;
    });

    setFilteredDriver(filtered);
  };

  const handleStatusUpdate = async (
    id: number,
    field: keyof Driver,
    newStatus: string
  ) => {
    const confirmToggle = window.confirm(
      `Are you sure you want to update ${field} to ${newStatus}?`
    );
    if (!confirmToggle) return;

    try {
      const supabase = createClient();
      setIsToggled(true);

      const { error } = await supabase
        .from("drivers")
        .update({ [field]: newStatus })
        .eq("driver_id", id);

      if (error) {
        console.error(`Error updating ${field} status:`, error.message);
        alert(`Failed to update ${field} status.`);
        setIsToggled(false);
      } else {
        const updatedDriver = driver.map((center) =>
          center.driver_id === id ? { ...center, [field]: newStatus } : center
        );
        setDriver(updatedDriver);
        setFilteredDriver(updatedDriver);
        alert(`${field} status updated successfully.`);
        setIsToggled(false);
      }
    } catch (err) {
      console.error(`Unexpected error updating ${field} status:`, err);
      alert("An unexpected error occurred.");
      setIsToggled(false);
    }
  };

  const handleStatusToggle = async (id: number, newStatus: boolean) => {
    const confirmToggle = window.confirm(
      "Are you sure you want to change the status?"
    );
    if (!confirmToggle) return;

    try {
      const supabase = createClient();

      // Show a loading indicator
      setIsToggled(true);

      // Toggle the status
      const { error } = await supabase
        .from("drivers")
        .update({ is_active: newStatus }) // Toggle status
        .eq("driver_id", id);

      if (error) {
        console.error("Error updating service center status:", error);
        alert("Failed to update the status.");
        setIsToggled(false); // Hide loading indicator
      } else {
        const updatedDriver = driver.map((center) =>
          center.driver_id === id ? { ...center, is_active: newStatus } : center
        );
        setDriver(updatedDriver);
        setFilteredDriver(updatedDriver);

        alert("Status updated successfully.");
        setIsToggled(false);
      }
    } catch (err) {
      console.error("Unexpected error updating status:", err);
      alert("An unexpected error occurred.");
      setIsToggled(false); // Hide loading indicator
    }
  };

  // const handleRequestToggle = async (id: number, currentStatus: boolean) => {
  //     const confirmToggle = window.confirm("Are you sure you want to change the status?");
  //     if (!confirmToggle) return;

  //     try {
  //       const supabase = createClient();

  //       setIsToggled(true);

  //       const { error } = await supabase
  //         .from("drivers")
  //         .update({ is_approved : currentStatus })
  //         .eq("driver_id", id);

  //       if (error) {
  //         console.error("Error updating service center status:", error);
  //         alert("Failed to update the status.");
  //         setIsToggled(false);
  //       } else {

  //         const updatedDriver = driver.map((center) =>
  //             center.driver_id === id
  //                 ? { ...center, is_approved: currentStatus }
  //                 : center
  //         );
  //         setDriver(updatedDriver);
  //         setFilteredDriver(updatedDriver);

  //         alert("Status updated successfully.");
  //         setIsToggled(false);  // Hide loading indicator
  //       }
  //     } catch (err) {
  //       console.error("Unexpected error updating status:", err);
  //       alert("An unexpected error occurred.");
  //       setIsToggled(false); // Hide loading indicator
  //     }
  //   };

  const columns = {
    Name: "Name",
    // DOB: "DOB",
    Contact_Number: "Contact No.",
    Email: "Email",
    Emergency_Number: "Emergency Contact No.",
    Driving_Licence: "Driving Licence",
    Photo: "Photo",
    driver_national_id_image: "National Id",
    driving_license_image:"Driving Licence Image",
    Yrs_of_exp: "Yrs of exp",
    Type_of_Vehicle_driven: "Type of Vehicle driven",
    Brands: "Brands",
    License_Category: "License Category",
    Language_Spoken: "Language Spoken",
    Status: "Status",
    // Request: 'Request',
    Admin_Verified: "Admin Verified",
    KYC_Status: "KYC Status",
    Police_Verification: "Police Verification",
    Refrel_Code: "Refrel Code",
    Refrence_Number: "Refrence Number",
    
  };

  const hiddenColumns = [
    // 'DOB',
    "Emergency_Number",
    "Driving_Licence",
    
    
    "Yrs_of_exp",
    "Type_of_Vehicle_driven",
    "Refrel_Code",
    "Photo",
    "Brands",
    "License_Category",
    "Language_Spoken",
   
    "Refrence_Number",
    "driver_national_id_image",
    "driving_license_image"
  ];

//   const handleUpload = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       console.log(`Uploading file for driver ID: ${id}`, file);
//       // Add your upload logic here (e.g., using FormData to send a POST request)
//     }
//   };
const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('driver_id', id.toString());
  
    try {
      const response = await fetch('/api/DriverDocUpload/DriverNationalId', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.error || 'Failed to upload');
  
      alert('File uploaded successfully');
  
      // ✅ Update state using the correct path from the API response
      const updatedDriver = driver.map((center) =>
        center.driver_id === id
          ? { ...center, driver_national_id_image: data.driverNationalIdImage }
          : center
      );
      setDriver(updatedDriver);
      setFilteredDriver(updatedDriver);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };
  const handleProfileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("driver_id", id.toString());
  
    try {
      const response = await fetch("/api/DriverDocUpload/DriverPhotoProof", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.message || "Failed to upload");
  
      alert("Profile photo uploaded successfully");
  
      // ✅ Update driver state with the new file URL
      setDriver((prev) =>
        prev.map((d) =>
          d.driver_id === id
            ? { ...d, profile_photo_url: data.profilePhotoUrl }
            : d
        )
      );
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      alert("Failed to upload profile photo");
    }
  };
  
  const handleLicenceUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("driver_id", id.toString());
  
    try {
      const response = await fetch("/api/DriverDocUpload/drivinglicenceupload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.message || "Failed to upload");
  
      alert("Licence photo uploaded successfully");
  
      // ✅ Update driver state with the new file URL
      setDriver((prev) =>
        prev.map((d) =>
          d.driver_id === id
            ? { ...d, driving_license_image: data.driving_license_image }
            : d
        )
      );
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      alert("Failed to upload Licence photo");
    }
  };
  

  const mappedData = filteredrivername.map((center:any) => ({
    Name: center.driver_name,
    DOB: center.dob,
    Contact_Number: center.phone_number,
    Email: center.email,
    Emergency_Number: center.emergency_contact_no,
    Driving_Licence: center.driving_license_no,
    Refrel_Code: center.refrel_code,
    Refrence_Number: center.refrence_no,
    // Photo: 'image path',
    Photo: (
        <>
          {/* View Photo */}
          {center.profile_photo_url ? (
            <a
            //   href={center.profile_photo_url}
              href={`${BASE_URL}${center.profile_photo_url}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "white",
                backgroundColor: "#007bff",
                padding: "5px 10px",
                borderRadius: "5px",
                marginRight: "5px",
                display: "inline-block",
              }}
            >
              View Photo
            </a>
          ) : (
            <span style={{ color: "gray", marginRight: "5px" }}>No Image</span>
          )}
    
          {/* ✅ Upload Button */}
          <label
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
              display: "inline-block",
            }}
          >
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleProfileUpload(e, center.driver_id)}
              style={{ display: "none" }}
            />
          </label>
        </>
      ),
    
    driver_national_id_image: (
        <>
          {/* View Photo */}
          {center.driver_national_id_image ? (
            <a
              href={`${BASE_URL}${center.driver_national_id_image}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "white",
                backgroundColor: "#007bff",
                padding: "5px 10px",
                borderRadius: "5px",
                marginRight: "5px",
                display: "inline-block",
              }}
            >
              View Photo
            </a>
          ) : (
            <span style={{ color: "gray", marginRight: "5px" }}>No Image</span>
          )}
    
          {/* Upload Button */}
          <label
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
              display: "inline-block",
            }}
          >
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, center.driver_id)}
              style={{ display: "none" }}
            />
          </label>
        </>
      ),
      driving_license_image: (
        <>
          {/* View Photo */}
          {center.driving_license_image ? (
            <a
              href={`${BASE_URL}${center.driving_license_image}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "white",
                backgroundColor: "#007bff",
                padding: "5px 10px",
                borderRadius: "5px",
                marginRight: "5px",
                display: "inline-block",
              }}
            >
              View Photo
            </a>
          ) : (
            <span style={{ color: "gray", marginRight: "5px" }}>No Image</span>
          )}
    
          {/* Upload Button */}
          <label
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
              display: "inline-block",
            }}
          >
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleLicenceUpload(e, center.driver_id)}
              style={{ display: "none" }}
            />
          </label>
        </>
      ),
    // driver_national_id_image: center.driver_national_id_image,
    Yrs_of_exp: center.experience_years,
    Type_of_Vehicle_driven: center.vehicle_type_experience,
    Brands: center.Brand,
    address: center.address,
    License_Category: center.license_category,
    Language_Spoken: center.language_spoken,

    Status: (
      <select
        value={center.is_active ? "Active" : "Inactive"}
        onChange={async (e) => {
          const newStatus = e.target.value === "Active"; // Convert value to boolean
          await handleStatusToggle(center.driver_id, newStatus); // Pass the new status
        }}
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          color: center.is_active ? "green" : "red",
        }}
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    ),
    // Request: (

    //     <select
    //     value={center.is_approved ? "Approved" : "Pending"}
    //     onChange={async (e) => {
    //       const currentStatus = e.target.value === "Approved"; // Convert value to boolean
    //       await handleRequestToggle(center.driver_id, currentStatus); // Pass the new status
    //     }}
    //     style={{
    //       cursor: "pointer",
    //       fontWeight: "bold",
    //       color: center.is_approved ? "green" : "red",
    //     }}
    //   >
    //     <option value="Approved">Approved</option>
    //     <option value="Pending">Pending</option>
    //   </select>

    // ),
    Admin_Verified: (
      <select
        value={center.isadminverified}
        onChange={(e) =>
          handleStatusUpdate(
            center.driver_id,
            "isadminverified",
            e.target.value
          )
        }
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          color:
            center.isadminverified === "approved"
              ? "green"
              : center.isadminverified === "pending"
              ? "orange"
              : "red",
        }}
      >
        <option value="approved">Approved</option>
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
      </select>
    ),
    KYC_Status: (
      <select
        value={center.kyc_status}
        onChange={(e) =>
          handleStatusUpdate(center.driver_id, "kyc_status", e.target.value)
        }
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          color:
            center.kyc_status === "approved"
              ? "green"
              : center.kyc_status === "pending"
              ? "orange"
              : "red",
        }}
      >
        <option value="approved">Approved</option>
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
      </select>
    ),
    Police_Verification: (
      <select
        value={center.police_verification_status}
        onChange={(e) =>
          handleStatusUpdate(
            center.driver_id,
            "police_verification_status",
            e.target.value
          )
        }
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          color:
            center.police_verification_status === "approved"
              ? "green"
              : center.police_verification_status === "pending"
              ? "orange"
              : "red",
        }}
      >
        <option value="approved">Approved</option>
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
      </select>
    ),

    // Reqeeuest: 'Approved',
    editLink: "#",
    deleteLink: "#",
  }));
  const handleClearFilters = () => {
    // Reset all filter states to default values
    setSearchQuery("");
    setContactNoQuery("");
    setStatusFilter("");
    setRequestFilter("");

    // Reset the filtered list to the original driver list
    setFilteredDriver(driver);
  };

  return (
    <main className="Service_center_list_main">
      <Header />
      <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
        <div className="inner_left">
          <Sidemenu onToggle={toggleClass} />
        </div>
        <div className="inner_right">
          <HeadingBredcrum
            heading="Driver List"
            breadcrumbs={[
              { label: "Home", link: "/", active: false },
              { label: "Driver List", active: true },
            ]}
          />
          <div className="filter_box">
            <div className="filter_heading_btnbox">
              <div className="service_form_heading">
                <span>
                  <img
                    src="/images/settings-sliders.svg"
                    alt=""
                    className="img-fluid"
                  />
                </span>
                Filter By
              </div>
            </div>
            <div className="filter_formbox">
              <form onSubmit={handleSearchSubmit}>
                <div className="inner_form_group">
                  <label htmlFor="driver_name">Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="driver_name"
                    id="driver_name"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="inner_form_group">
                  <label htmlFor="driver_contact">Contact No.</label>
                  <input
                    className="form-control"
                    type="text"
                    name="driver_contact"
                    id="driver_contact"
                    value={contactNoQuery}
                    onChange={(e) => setContactNoQuery(e.target.value)}
                  />
                </div>
                <div className="inner_form_group">
                  <label htmlFor="status">Status</label>
                  <select
                    className="form-control"
                    name="status"
                    id="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <div className="down_arrow_btn">
                    <img
                      src="/images/angle-small-down.svg"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                </div>
                <div className="inner_form_group">
                  <label htmlFor="request">Request</label>
                  <select
                    className="form-control"
                    name="request"
                    id="request"
                    value={requestFilter}
                    onChange={(e) => setRequestFilter(e.target.value)}
                  >
                    <option value="">Select Request</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                  </select>
                  <div className="down_arrow_btn">
                    <img
                      src="/images/angle-small-down.svg"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                </div>

                <div className="inner_form_group inner_form_group_submit">
                  <div>
                    <input
                      type="submit"
                      className="submite_btn"
                      value="Search"
                    />
                  </div>
                  <div>
                    {filteredrivername.length > 0 && (
                      <CSVLink
                        data={mappedData}
                        headers={[
                          { label: "Driver Name", key: "Name" },
                          { label: "DOB", key: "DOB" },
                          { label: "Contact Number", key: "Contact_Number" },
                          { label: "Email", key: "Email" },
                          {
                            label: "Emergency Number",
                            key: "Emergency_Number",
                          },
                          { label: "Driving Licence", key: "Driving_Licence" },
                          { label: "Photo", key: "Photo" },
                          { label: "National ID", key: "National_Id" },
                          { label: "Years of Experience", key: "Yrs_of_exp" },
                          {
                            label: "Type of Vehicle Driven",
                            key: "Type_of_Vehicle_driven",
                          },
                          { label: "Brands", key: "Brands" },
                          {
                            label: "License Category",
                            key: "License_Category",
                          },
                          { label: "Language Spoken", key: "Language_Spoken" },
                        ]}
                        filename="driver_details.csv"
                        className="close_btn"
                      >
                        Export All
                      </CSVLink>
                    )}
                  </div>
                  <div>
                    <input
                      type="button"
                      className="close_btn"
                      value="Clear"
                      onClick={handleClearFilters} // Attach the handler here
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="data_listing_box mt-3">
            <div className="filter_heading_btnbox">
              <div className="service_form_heading">
                <span>
                  <img
                    src="/images/driver-list.svg"
                    alt=""
                    className="img-fluid"
                  />
                </span>
                Drivers List
              </div>
            </div>
            <div className="filter_data_table">
              <DataTable
                columns={columns}
                data={mappedData}
                hiddenColumns={hiddenColumns}
                showStatusButton={true}
                showRequestButton={true}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ManageDriver;
