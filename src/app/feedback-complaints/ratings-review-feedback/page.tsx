// final code 
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "../../../../components/Header";
import Sidemenu from "../../../../components/Sidemenu";
import { DataTable } from "../../../../components/ui/datatable";
import Link from "next/link";

const FeedbackComplaintsRating = () => {
    const [isToggled, setIsToggled] = useState(false); // State for toggle


    const toggleClass = () => {
        setIsToggled(!isToggled); // Toggle the state
    };

    const columns = {
        Service_center_name: "Service Center Name",
        Driver_Name: "Driver Name",
        Trip_id: "Trip ID",
        Feedback: "Feedback",
        Rating: "Rating",
    };

    const data = [
        {
            Service_center_name: 'ABC Servicing',
            Driver_Name: 'Rahul',
            Trip_id: '45',
            Feedback: '"Lorem ipsum dolor sit amet"',
            Rating: [
                { src: '/images/fill-star.svg', alt: 'Rating 1' },
                { src: '/images/fill-star.svg', alt: 'Rating 2' },
                { src: '/images/fill-star.svg', alt: 'Rating 3' },
                { src: '/images/unfill-star.svg', alt: 'Rating 4' },
                { src: '/images/unfill-star.svg', alt: 'Rating 5' }
            ],
            editLink: '#', // Edit page link
            deleteLink: '#', // Delete page link
        },
        {
            Service_center_name: 'ABC Servicing',
            Driver_Name: 'Rahul',
            Trip_id: '45',
            Feedback: '"Lorem ipsum dolor sit amet"',
            Rating: [
                { src: '/images/fill-star.svg', alt: 'Rating 1' },
                { src: '/images/unfill-star.svg', alt: 'Rating 2' },
                { src: '/images/unfill-star.svg', alt: 'Rating 3' },
                { src: '/images/unfill-star.svg', alt: 'Rating 4' },
                { src: '/images/unfill-star.svg', alt: 'Rating 5' }
            ],
            editLink: '#', // Edit page link
            deleteLink: '#', // Delete page link
        },
        {
            Service_center_name: 'ABC Servicing',
            Driver_Name: 'Rahul',
            Trip_id: '45',
            Feedback: '"Lorem ipsum dolor sit amet"',
            Rating: [
                { src: '/images/fill-star.svg', alt: 'Rating 1' },
                { src: '/images/fill-star.svg', alt: 'Rating 2' },
                { src: '/images/fill-star.svg', alt: 'Rating 3' },
                { src: '/images/fill-star.svg', alt: 'Rating 4' },
                { src: '/images/unfill-star.svg', alt: 'Rating 5' }
            ],
            editLink: '#', // Edit page link
            deleteLink: '#', // Delete page link
        },
    ];

    const hiddenColumns = [];

    // Function to render the Rating field
    const renderRating = (rating: any[]) => {
        if (Array.isArray(rating)) {
            return (
                <div className="rating-images">
                    {rating.map((image, index) => (
                        <img
                            key={index}
                            src={image.src}
                            alt={image.alt || `Rating ${index + 1}`}
                            className="img-fluid"
                            style={{ width: '20px', marginRight: '5px' }}
                        />
                    ))}
                </div>
            );
        }
        return rating || 'No rating';
    };

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
                                    <label htmlFor="service_center_name">Service Center Name</label>
                                    <input className="form-control" type="text" name="service_center_name" id="service_center_name" />
                                </div>
                                <div className="inner_form_group">
                                    <label htmlFor="driver_name">Driver Name</label>
                                    <input className="form-control" type="text" name="driver_name" id="driver_name" />
                                </div>
                                <div className="inner_form_group">
                                    <label htmlFor="trip_id">Trip ID</label>
                                    <input className="form-control" type="text" name="trip_id" id="trip_id" />
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
                        <DataTable
                                columns={{
                                    ...columns,
                                    Rating: 'Rating',
                                }}
                                data={data.map((item) => ({
                                    ...item,
                                    Rating: renderRating(item.Rating),
                                }))}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default FeedbackComplaintsRating