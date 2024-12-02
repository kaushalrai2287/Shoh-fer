"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from '../../../../components/Header';
import Sidemenu from "../../../../components/Sidemenu";
import { DataTable } from "../../../../components/ui/datatable";
import Link from "next/link";

const page = () => {
    const [isToggled, setIsToggled] = useState(false); // State for toggle

    const toggleClass = () => {
        setIsToggled(!isToggled); // Toggle the state
    };

    const columns = {
        Role_Name: "Role Name",
    };

    const data = [
        {
            Role_Name: 'Rahul',
            editLink: '#',
            deleteLink: '#',
        },
        {
            Role_Name: 'Rahul',
            editLink: '#',
            deleteLink: '#',
        },
        {
            Role_Name: 'Rahul',
            editLink: '#',
            deleteLink: '#',
        },
        {
            Role_Name: 'Rahul',
            editLink: '#',
            deleteLink: '#',
        },
        {
            Role_Name: 'Rahul',
            editLink: '#',
            deleteLink: '#',
        },
    ];

    const hiddenColumns = [];

    return (
        <main className="rolls_list_main">
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
                                <Link href="/rolls-permission/add">
                                    <button className="submite_btn">Add</button>
                                </Link>
                            </div>
                        </div>
                        <div className="filter_formbox">
                            <form action="">
                                <div className="inner_form_group">
                                    <label htmlFor="role_name">Role Name</label>
                                    <input className="form-control" type="text" name="role_name" id="role_name" />
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
                                    <img src="/images/user-list.svg" alt="" className="img-fluid" />
                                </span>
                                Roll List
                            </div>
                        </div>
                        <div className="filter_data_table">
                            <DataTable
                                columns={columns}
                                data={data}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default page;
