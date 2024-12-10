// final code 
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from '../../../../../components/Header';
import Sidemenu from "../../../../../components/Sidemenu";
import { DataTable } from "../../../../../components/ui/datatable";
import Link from "next/link";

const NotificatioDriverlist = () => {
    const [isToggled, setIsToggled] = useState(false); // State for toggle


    const toggleClass = () => {
        setIsToggled(!isToggled); // Toggle the state
    };

    const columns = {
        Driver_Name: "Driver Name",
        Title: "Title",
        Upload_Document: "Document",
        Message: "Message",
    };

    const data = [
        {
            Driver_Name: 'Rahul',
            Title: 'Lorem sed tempor incididunt ut',
            Upload_Document: 'image',
            Message: '"Lorem ipsum dolor sit amet"',
            editLink: '#', // Edit page link
            deleteLink: '#', // Delete page link
        },
    ];

    const hiddenColumns = [];


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
                            <div className="filter_btn">
                                <Link href="/notifications/driver/add">
                                    <button className="submite_btn">Add</button>
                                </Link>
                            </div>
                        </div>
                        <div className="filter_formbox">
                            <form action="">
                                <div className="inner_form_group">
                                    <label htmlFor="driver_name">Driver Name</label>
                                    <input className="form-control" type="text" name="driver_name" id="driver_name" />
                                </div>
                                <div className="inner_form_group">
                                    <label htmlFor="search_service_area">Title</label>
                                    <input className="form-control" type="text" name="search_service_area" id="search_service_area" />
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
                                Driver Notification List
                            </div>
                        </div>
                        <div className="filter_data_table">
                            <DataTable columns={columns} data={data} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default NotificatioDriverlist