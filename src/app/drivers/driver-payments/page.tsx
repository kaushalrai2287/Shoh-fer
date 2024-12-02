/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from '../../../../components/Header';
import Sidemenu from "../../../../components/Sidemenu";
import { DataTable } from "../../../../components/ui/datatable";
import Link from "next/link";

const DriverPay = () => {
    const [isToggled, setIsToggled] = useState(false); // State for toggle

    const toggleClass = () => {
        setIsToggled(!isToggled); // Toggle the state
    };

    const columns = {
        Driver_name: "Driver Name",
        Service_Center_Name: "Service Center Name",
        Date: "Date",
        pickup_location: "Pickup Location",
        drop_location: "Drop Location",
        Amount: "Amount",
        Billing: "Billing",
    };

    const data = [
        {
            Driver_name: 'Rahul',
            Service_Center_Name: 'Evonix center',
            Date: '11/05/2024',
            pickup_location: 'Wakad',
            drop_location: 'Ravet',
            Amount: '1200',
            Billing: 'Paid',
            editLink: '#',
            deleteLink: '#',
        },
    ];

    const hiddenColumns = [
        'pickup_location',
        'drop_location',
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
                                    <label htmlFor="billing">Billing</label>
                                    <select className="form-control" name="billing" id="billing">
                                        <option value="">Select Billing</option>
                                        <option value="Paid">Paid</option>
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
                                    <img src="/images/wallet-list.svg" alt="" className="img-fluid" />
                                </span>
                                Driver Payments List
                            </div>
                        </div>
                        <div className="filter_data_table">
                            <DataTable
                                columns={columns}
                                data={data}
                                hiddenColumns={hiddenColumns}
                                showBillingButton={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DriverPay;
