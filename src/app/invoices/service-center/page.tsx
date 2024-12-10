// final code 
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from '../../../../components/Header';
import Sidemenu from "../../../../components/Sidemenu";
import { DataTable } from "../../../../components/ui/datatable";
import Link from "next/link";

const InvoceService = () => {
    const [isToggled, setIsToggled] = useState(false); // State for toggle


    const toggleClass = () => {
        setIsToggled(!isToggled); // Toggle the state
    };

    const columns = {
        Service_Center_Name: "Service Center Name",
        Driver_Name: "Driver Name",
        Trip_Id: "Trip Id",
        Trip_Status: "Trip Status",
        Date: "Date",
        Cost: "Cost",
        Status: "Status", // Add Status to columns
    };

    const data = [
        {
            Service_Center_Name: 'abc services',
            Driver_Name: 'Rahul',
            Trip_Id: '889',
            Trip_Status: 'Completed',
            Date: '12-04-2024',
            Cost: '1200',
            Status: 'Active',
            editLink: '#', // Edit page link
            deleteLink: '#', // Delete page link
        },
        {
            Service_Center_Name: 'abc services',
            Driver_Name: 'Rahul',
            Trip_Id: '889',
            Trip_Status: 'Completed',
            Date: '12-04-2024',
            Cost: '1200',
            Status: 'Active',
            editLink: '#', // Edit page link
            deleteLink: '#', // Delete page link
        },
        {
            Service_Center_Name: 'abc services',
            Driver_Name: 'Rahul',
            Trip_Id: '889',
            Trip_Status: 'Completed',
            Date: '12-04-2024',
            Cost: '1200',
            Status: 'Active',
            editLink: '#', // Edit page link
            deleteLink: '#', // Delete page link
        },
        {
            Service_Center_Name: 'abc services',
            Driver_Name: 'Rahul',
            Trip_Id: '889',
            Trip_Status: 'Completed',
            Date: '12-04-2024',
            Cost: '1200',
            Status: 'Active',
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
                        </div>
                        <div className="filter_formbox">
                            <form action="">
                                <div className="inner_form_group">
                                    <label htmlFor="status">Status</label>
                                    <select className="form-control" name="status" id="status">
                                        <option value="">Select Status</option>
                                        <option value="Paid">Paid</option>
                                        <option value="In Process">In Process</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                    <div className="down_arrow_btn">
                                        <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
                                    </div>
                                </div>
                                <div className="inner_form_group">
                                    <label htmlFor="start_date">Start Date</label>
                                    <input className="form-control" type="date" name="start_date" id="start_date" />
                                </div>
                                <div className="inner_form_group">
                                    <label htmlFor="end_date">End Date</label>
                                    <input className="form-control" type="date" name="end_date" id="end_date" />
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
                                Service Center Invoices List
                            </div>
                        </div>
                        <div className="filter_data_table">
                            <DataTable columns={columns} data={data}
                                showStatusButton={true} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default InvoceService