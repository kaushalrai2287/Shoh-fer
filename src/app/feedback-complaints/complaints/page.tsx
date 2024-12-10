// final code 
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "../../../../components/Header";
import Sidemenu from "../../../../components/Sidemenu";
import { DataTable } from "../../../../components/ui/datatable";
import Link from "next/link";

const FeedbackComplaints = () => {
    const [isToggled, setIsToggled] = useState(false); // State for toggle


    const toggleClass = () => {
        setIsToggled(!isToggled); // Toggle the state
    };

    const columns = {
        Raised_by: "Raised By",
        Raised_For: "Raised For",
        Trip_id: "Trip ID",
        Complaint_Box: "Complaint Box",
        Request: 'Request',
    };

    const data = [
        {
            Raised_by: 'ABC Servicing',
            Raised_For: 'Rahul',
            Trip_id: '45',
            Complaint_Box: '"Lorem ipsum dolor sit amet"',
            Request: 'Approved',
            editLink: '#', // Edit page link
            deleteLink: '#', // Delete page link
        },
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
                                    <label htmlFor="trip_id">Trip ID</label>
                                    <input className="form-control" type="text" name="trip_id" id="trip_id" />
                                </div>
                                <div className="inner_form_group">
                                    <label htmlFor="Status">Request</label>
                                    <select className="form-control" name="Status" id="Status">
                                        <option value="">Select Request</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Reject">Reject</option>
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
                                    <img src="/images/rating-list.svg" alt="" className="img-fluid" />
                                </span>
                                Ratings & Feedback List
                            </div>
                        </div>
                        <div className="filter_data_table">
                            <DataTable columns={columns} data={data} showRequestButton={true} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default FeedbackComplaints