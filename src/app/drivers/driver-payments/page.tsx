// /* eslint-disable react-hooks/rules-of-hooks */
// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import Header from '../../../../components/Header';
// import Sidemenu from "../../../../components/Sidemenu";
// import { DataTable } from "../../../../components/ui/datatable";
// import Link from "next/link";

// const DriverPay = () => {
//     const [isToggled, setIsToggled] = useState(false);

//     const toggleClass = () => {
//         setIsToggled(!isToggled); 
//     };

//     const columns = {
//         Driver_name: "Driver Name",
//         Service_Center_Name: "Service Center Name",
//         Date: "Date",
//         pickup_location: "Pickup Location",
//         drop_location: "Drop Location",
//         Amount: "Amount",
//         Billing: "Billing",
//     };

//     const data = [
//         {
//             Driver_name: 'Rahul',
//             Service_Center_Name: 'Evonix center',
//             Date: '11/05/2024',
//             pickup_location: 'Wakad',
//             drop_location: 'Ravet',
//             Amount: '1200',
//             Billing: 'Paid',
//             editLink: '#',
//             deleteLink: '#',
//         },
//     ];

//     const hiddenColumns = [
//         'pickup_location',
//         'drop_location',
//     ];

//     return (
//         <main className="Service_center_list_main">
//             <Header />
//             <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
//                 <div className="inner_left">
//                     <Sidemenu onToggle={toggleClass} />
//                 </div>
//                 <div className="inner_right">
//                     <div className="filter_box">
//                         <div className="filter_heading_btnbox">
//                             <div className="service_form_heading">
//                                 <span>
//                                     <img src="/images/settings-sliders.svg" alt="" className="img-fluid" />
//                                 </span>
//                                 Filter By
//                             </div>
//                         </div>
//                         <div className="filter_formbox">
//                             <form action="">
//                                 <div className="inner_form_group">
//                                     <label htmlFor="billing">Billing</label>
//                                     <select className="form-control" name="billing" id="billing">
//                                         <option value="">Select Billing</option>
//                                         <option value="Paid">Paid</option>
//                                         <option value="Pending">Pending</option>
//                                     </select>
//                                     <div className="down_arrow_btn">
//                                         <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
//                                     </div>
//                                 </div>
//                                 <div className="inner_form_group">
//                                     <label htmlFor="start_date">Start Date</label>
//                                     <input className="form-control" type="date" name="start_date" id="start_date" />
//                                 </div>
//                                 <div className="inner_form_group">
//                                     <label htmlFor="end_date">End Date</label>
//                                     <input className="form-control" type="date" name="end_date" id="end_date" />
//                                 </div>
//                                 <div className="inner_form_group inner_form_group_submit">
//                                     <input type="submit" className='submite_btn' value="Search" />
//                                     <input type="submit" className='close_btn' value="Export All" />
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                     <div className="data_listing_box mt-3">
//                         <div className="filter_heading_btnbox">
//                             <div className="service_form_heading">
//                                 <span>
//                                     <img src="/images/wallet-list.svg" alt="" className="img-fluid" />
//                                 </span>
//                                 Driver Payments List
//                             </div>
//                         </div>
//                         <div className="filter_data_table">
//                             <DataTable
//                                 columns={columns}
//                                 data={data}
//                                 hiddenColumns={hiddenColumns}
//                                 showBillingButton={true}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// };

// export default DriverPay;
"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../../components/Header";
import Sidemenu from "../../../../components/Sidemenu";
import { DataTable } from "../../../../components/ui/datatable";
import { createClient } from "../../../../utils/supabase/client";
import HeadingBredcrum from "../../../../components/HeadingBredcrum";

const supabase = createClient();

type DriverPayment = {
    driver_name: string;
    service_center_name: string;
    date: string;
    pickup_location: string;
    drop_location: string;
    amount: number;
    billing: string;
};

const DriverPay = () => {
    const [isToggled, setIsToggled] = useState(false);
    const [data, setData] = useState<DriverPayment[]>([]);
    const [formData, setFormData] = useState({
        billing: "",
        start_date: "",
        end_date: "",
    });

    const toggleClass = () => setIsToggled(!isToggled);

    // Fetch data from the 'driverpayment' table
    const fetchData = async () => {
        let query = supabase.from("driver_payments").select("*");

        if (formData.billing) {
            query = query.eq("billing", formData.billing);
        }

        if (formData.start_date && formData.end_date) {
            query = query
                .gte("date", formData.start_date)
                .lte("date", formData.end_date);
        }

        const { data, error } = await query;
        if (error) {
            console.error("Error fetching data:", error.message);
        } else {
            setData(data as DriverPayment[]);
        }
    };

    const handleFilterChange = (e: { target: { name: string; value: string } }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearch = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        fetchData();
    };

    const handleReset = () => {
        setFormData({
            billing: "",
            start_date: "",
            end_date: "",
        });
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);
    

    const columns = {
        driver_name: "Driver Name",
        service_center_name: "Service Center Name",
        date: "Date",
        pickup_location: "Pickup Location",
        drop_location: "Drop Location",
        amount: "Amount",
        // billing: "Billing",
    };

    const hiddenColumns = ["pickup_location", "drop_location"];

    return (
        <main className="Service_center_list_main">
            <Header />
            <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
                <div className="inner_left">
                    <Sidemenu onToggle={toggleClass} />
                </div>
                <div className="inner_right">
                <HeadingBredcrum
            heading="Driver Payments Listing"
            breadcrumbs={[
              { label: "Home", link: "/", active: false },
              { label: "Driver Payment List", active: true },
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
                            <form onSubmit={handleSearch}>
                                <div className="inner_form_group">
                                    <label htmlFor="billing">Billing</label>
                                    <select
                                        className="form-control"
                                        name="billing"
                                        id="billing"
                                        value={formData.billing}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Select Billing</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                                <div className="inner_form_group">
                                    <label htmlFor="start_date">Start Date</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="start_date"
                                        id="start_date"
                                        value={formData.start_date}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="inner_form_group">
                                    <label htmlFor="end_date">End Date</label>
                                    <input
                                        className="form-control"
                                        type="date"
                                        name="end_date"
                                        id="end_date"
                                        value={formData.end_date}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="inner_form_group inner_form_group_submit">
                                    <button type="submit" className="submite_btn">
                                        Search
                                    </button>
                                    <button
                                        type="button"
                                        className="close_btn"
                                        onClick={handleReset}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="data_listing_box mt-3">
                        <div className="filter_heading_btnbox">
                            <div className="service_form_heading">
                                <span>
                                    <img
                                        src="/images/wallet-list.svg"
                                        alt=""
                                        className="img-fluid"
                                    />
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
