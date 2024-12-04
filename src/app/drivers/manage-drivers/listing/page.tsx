"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import Header from "../../../../../components/Header";
import Sidemenu from "../../../../../components/Sidemenu";
import { DataTable } from "../../../../../components/ui/datatable";
import Link from "next/link";
import { createClient } from "../../../../../utils/supabase/client";


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
    is_approved :boolean;
    Brand:string;
    vehicle_type_experience:string;
    emergency_contact_no:string;
  
};

const ManageDriver = () => {
    const [isToggled, setIsToggled] = useState(false); 
    const [driver, setDriver] = useState<Driver[]>([]);

    const toggleClass = () => {
        setIsToggled(!isToggled);
    };
    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                .from("drivers")
                .select("*"); 
              

                // const updatedData = data?.map((center: any) => ({
                //     ...center,
                  
                // }));
                console.log(data);

                if (error) throw error;

                setDriver(data || []);
                // setDriver(updatedData || []); 
            } catch (err) {
                console.error("Error fetching service centers:", err);
            }
        };
          

        fetchDriver();
    }, []);

    const handleStatusToggle = async (id: number, currentStatus: boolean) => {
        const confirmToggle = window.confirm("Are you sure you want to change the status?");
        if (!confirmToggle) return;
      
        try {
          const supabase = createClient();
          
          // Show a loading indicator
          setIsToggled(true);  // Optionally use a separate loading state
      
          // Toggle the status
          const { error } = await supabase
            .from("drivers")
            .update({ is_active: !currentStatus }) // Toggle status
            .eq("driver_id", id);
      
          if (error) {
            console.error("Error updating service center status:", error);
            alert("Failed to update the status.");
            setIsToggled(false); // Hide loading indicator
          } else {
            // Update the status in the local state
            setDriver((prev) =>
              prev.map((center) =>
                center.driver_id === id
                  ? { ...center, is_active: !currentStatus }
                  : center
              )
            );
            
            alert("Status updated successfully.");
            setIsToggled(false);  // Hide loading indicator
          }
        } catch (err) {
          console.error("Unexpected error updating status:", err);
          alert("An unexpected error occurred.");
          setIsToggled(false); // Hide loading indicator
        }
      };
    const handleRequestToggle = async (id: number, currentStatus: boolean) => {
        const confirmToggle = window.confirm("Are you sure you want to change the status?");
        if (!confirmToggle) return;
      
        try {
          const supabase = createClient();
          
          // Show a loading indicator
          setIsToggled(true);  // Optionally use a separate loading state
      
          // Toggle the status
          const { error } = await supabase
            .from("drivers")
            .update({ is_approved : !currentStatus }) // Toggle status
            .eq("driver_id", id);
      
          if (error) {
            console.error("Error updating service center status:", error);
            alert("Failed to update the status.");
            setIsToggled(false); // Hide loading indicator
          } else {
            // Update the status in the local state
            setDriver((prev) =>
              prev.map((center) =>
                center.driver_id === id
                  ? { ...center, is_approved : !currentStatus }
                  : center
              )
            );
            
            alert("Status updated successfully.");
            setIsToggled(false);  // Hide loading indicator
          }
        } catch (err) {
          console.error("Unexpected error updating status:", err);
          alert("An unexpected error occurred.");
          setIsToggled(false); // Hide loading indicator
        }
      };

    const columns = {
        Name: "Name",
        DOB: "DOB",
        Contact_Number: "Contact No.",
        Email: "Email",
        Emergency_Number: "Emergency Contact No.",
        Driving_Licence: "Driving Licence",
        Photo: "Photo",
        National_Id: "National Id",
        Yrs_of_exp: "Yrs of exp",
        Type_of_Vehicle_driven: "Type of Vehicle driven",
        Brands: "Brands",
        License_Category: "License Category",
        Language_Spoken: "Language Spoken",
        Status: 'Status',
        Request: 'Request'
    };

  
    const hiddenColumns = [
        'DOB',
        'Emergency_Number',
        'Driving_Licence',
        'Photo',
        'National_Id',
        'Yrs_of_exp',
        'Type_of_Vehicle_driven',
        'Brands',
        'License_Category',
        'Language_Spoken',
    ];

    const mappedData = driver.map((center) => ({
        
        Name:  center.driver_name,
        DOB: center.dob,
        Contact_Number: center.phone_number,
        Email:center.email,
        Emergency_Number: center.emergency_contact_no,
        Driving_Licence: center.driving_license_no,
        Photo: 'image path',
        National_Id: center.driver_document,
        Yrs_of_exp: center.experience_years,
        Type_of_Vehicle_driven: center.vehicle_type_experience,
        Brands: center.Brand,
        address:center.address,
        License_Category: center.license_category,
        Language_Spoken: center.language_spoken,
        Status: (
            <span
                onClick={() => handleStatusToggle(center.driver_id, center.is_active)}
                style={{
                    cursor: "pointer", 
                    color: center.is_active ? "green" : "red", 
                    fontWeight: "bold"
                }}
            >
                {center.is_active ? "Active" : "Inactive"}
            </span>
        ),
        Request: (
            <span
                onClick={() => handleRequestToggle(center.driver_id, center.is_approved )}
                style={{
                    cursor: "pointer", 
                    color: center.is_approved  ? "green" : "red", 
                    fontWeight: "bold"
                }}
            >
                {center.is_approved ? "Approved" : "Declined"}
            </span>
        ),

        // Reqeeuest: 'Approved',
        editLink: '#',
        deleteLink: '#',
    }));


    return (
        <main className="Service_center_list_main">
            <Header />
            <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
                <div className="inner_left">
                    <Sidemenu onToggle={toggleClass} />
                </div>
                <div className="inner_right">
                    <div className="filter_box">
                        <div className="filter_heading_btnbox">
                            <div className="service_form_heading">
                                <span>
                                    <img src="/images/settings-sliders.svg" alt="" className="img-fluid" />
                                </span>
                                Filter By
                            </div>
                        </div>
                        <div className="filter_formbox">
                            <form action="">
                                <div className="inner_form_group">
                                    <label htmlFor="driver_name">Name</label>
                                    <input className="form-control" type="text" name="driver_name" id="driver_name" />
                                </div>
                                <div className="inner_form_group">
                                    <label htmlFor="driver_contact">Contact No.</label>
                                    <input className="form-control" type="text" name="driver_contact" id="driver_contact" />
                                </div>
                                <div className="inner_form_group">
                                    <label htmlFor="status">Status</label>
                                    <select className="form-control" name="status" id="status">
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                    <div className="down_arrow_btn">
                                        <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
                                    </div>
                                </div>
                                <div className="inner_form_group">
                                    <label htmlFor="request">Request</label>
                                    <select className="form-control" name="request" id="request">
                                        <option value="">Select Request</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                    <div className="down_arrow_btn">
                                        <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
                                    </div>
                                </div>
                                <div className="inner_form_group inner_form_group_submit">
                                    <input type="submit" className='submite_btn' value="Search" />
                                    <input type="submit" className='close_btn' value="Export All" />
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="data_listing_box mt-3">
                        <div className="filter_heading_btnbox">
                            <div className="service_form_heading">
                                <span>
                                    <img src="/images/driver-list.svg" alt="" className="img-fluid" />
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
                                showRequestButton={true}  // Pass true to show the Request button
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ManageDriver;
