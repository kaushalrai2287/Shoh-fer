"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from '../../../../components/Header';
import Sidemenu from "../../../../components/Sidemenu";
import { DataTable } from "../../../../components/ui/datatable";
import Link from "next/link";

const ManageDriver = () => {
    const [isToggled, setIsToggled] = useState(false); // State for toggle

    const toggleClass = () => {
        setIsToggled(!isToggled); // Toggle the state
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

    const data = [
        {
            Name: 'Rahul',
            DOB: '15-05-1993',
            Contact_Number: '9404617782',
            Email: 'rahul@gmail.com',
            Emergency_Number: '8668720842',
            Driving_Licence: 'image path',
            Photo: 'image path',
            National_Id: 'image path',
            Yrs_of_exp: '4.5 years',
            Type_of_Vehicle_driven: 'Car',
            Brands: 'Mahindra',
            License_Category: 'LMV-NT',
            Language_Spoken: 'Marathi',
            Status: 'Active',
            Request: 'Approved',
            editLink: '#',
            deleteLink: '#',
        },
    ];

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
                        {/* <div className="filter_data_table">
                            <DataTable
                                columns={columns}
                                data={data}
                                hiddenColumns={hiddenColumns}
                                showStatusButton={true}
                                showRequestButton={true}  // Pass true to show the Request button
                            />
                        </div> */}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ManageDriver;
