// final code 
"use client";

import React, { useState } from "react";
import Image from "next/image";

import Header from "../../../../../../components/Header";
import Sidemenu from "../../../../../../components/Sidemenu";
import { DataTable } from "../../../../../../components/ui/datatable";


import Link from "next/link";

const BrandList = () => {
    const [isToggled, setIsToggled] = useState(false); // State for toggle


    const toggleClass = () => {
        setIsToggled(!isToggled); // Toggle the state
    };

    const columns = {
        Brand: "Brand",
    };

    const data = [
        {
            Brand: 'Mahindra',
            editLink: '#', // Edit page link
            deleteLink: '#', // Delete page link
        },
    ];

    const hiddenColumns = [];


    return (
        <main className="brand_list_main">
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
                                <Link href="/miscellaneous/brand/add">
                                    <button className="submite_btn">Add</button>
                                </Link>
                            </div>
                        </div>
                        <div className="filter_formbox">
                            <form action="">
                                <div className="inner_form_group">
                                    <label htmlFor="brand">Brand</label>
                                    <select className="form-control" name="brand" id="brand">
                                        <option value="">Select Brand</option>
                                        <option value="Brand one">Brand one</option>
                                        <option value="Brand two">Brand two</option>
                                        <option value="Brand three">Brand three</option>
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
                                    <img src="/images/bars-sort.svg" alt="" className="img-fluid" />
                                </span>
                                Brand List
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

export default BrandList