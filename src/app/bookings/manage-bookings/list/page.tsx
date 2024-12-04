// final code 
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from '../../../../../components/Header';
import Sidemenu from "../../../../../components/Sidemenu";
import { DataTable } from "../../../../../components/ui/datatable";
import Link from "next/link";

const ListBooking = () => {
    const [isToggled, setIsToggled] = useState(false); // State for toggle

    const toggleClass = () => {
        setIsToggled(!isToggled); // Toggle the state
    };

    const columns = {
        Service_Center_Name: "Service Center Name",
        Driver_Name: "Driver Name",
        Trip_ID: "Trip ID",
        Tracking_link: "Tracking Link",
        Vehicle_Type: "Vehicle Type",
        Model: "Model",
        Vehicle_Condition: "Vehicle Condition",
        Customer_Name: "Customer Name",
        Vehicle_Number: "Vehicle Number",
        Phone_Number: "Phone Number",
        Pick_Up_Location: "Pick Up Location",
        Drop_Location: "Drop Location",
        Pick_Up_Date_Time: "Pick Up Date, Time",
        Special_Instructions: "Special Instructions",
        Driver_Experince: "Driver Experince",
        Driver_Rating: "Driver Rating",
        Status: "Status",
        Booking: "Booking",
    };

    const data = [
        {
            Service_Center_Name: 'abc services',
            Driver_Name: '878877',
            Trip_ID: 'servicing',
            Tracking_link: 'wakad',
            Vehicle_Type: 'image',
            Model: 'Rahul',
            Vehicle_Condition: '9898767654',
            Customer_Name: 'rahul@gmail.com',
            Vehicle_Number: '8888888888',
            Phone_Number: 'Aakruti Aveneue',
            Pick_Up_Location: 'Pune',
            Drop_Location: 'Maharastra',
            Pick_Up_Date_Time: '431203',
            Special_Instructions: '431203',
            Driver_Experince: '431203',
            Driver_Rating: '431203',
            Status: 'Active',
            Booking: 'Cancel Booking',
            editLink: '#', // Edit page link
            deleteLink: '#', // Delete page link
        },
    ];

    const hiddenColumns = [
        'Tracking_link',
        'Vehicle_Type',
        'Model',
        'Vehicle_Condition',
        'Customer_Name',
        'Vehicle_Number',
        'Phone_Number',
        'Pick_Up_Date_Time',
        'Special_Instructions',
        'Driver_Experince',
        'Driver_Rating',
    ];


    return (
        <main className="Service_center_list_main">
            <Header />
            <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
                <div className="inner_left">
                    <Sidemenu onToggle={toggleClass} />
                </div>
                <div className="inner_right">
                    {/* <h1><strong>rahul</strong></h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Library</li>
                        </ol>
                    </nav> */}
                    <div className="filter_box">
                        <div className="filter_heading_btnbox">
                            <div className="service_form_heading">
                                <span>
                                    <img src="/images/settings-sliders.svg" alt="" className="img-fluid" />
                                </span>
                                Filter By
                            </div>
                            <div className="filter_btn">
                                <Link href="/bookings/manage-bookings/add">
                                    <button className="submite_btn">Add</button>
                                </Link>
                            </div>
                        </div>
                        <div className="filter_formbox">
                            <form action="">
                                <div className="inner_form_group">
                                    <label htmlFor="search_service_name">Service Center Name</label>
                                    <input className="form-control" type="text" name="search_service_name" id="search_service_name" />
                                </div>
                                <div className="inner_form_group">
                                    <label htmlFor="driver_name">Driver Name</label>
                                    <input className="form-control" type="text" name="driver_name" id="driver_name" />
                                </div>
                                <div className="inner_form_group">
                                    <label htmlFor="date">Date</label>
                                    <input className="form-control" type="date" name="date" id="date" />
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
                                    <img src="/images/bars-sort.svg" alt="" className="img-fluid" />
                                </span>
                                Booking List
                            </div>
                        </div>
                        <div className="filter_data_table">
                            <DataTable columns={columns} data={data} hiddenColumns={hiddenColumns}
                                showStatusButton={true} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ListBooking