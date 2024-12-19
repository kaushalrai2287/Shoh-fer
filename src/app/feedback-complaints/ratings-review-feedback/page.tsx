"use client";

import React, { useEffect, useState } from "react";
import Header from "../../../../components/Header";
import Sidemenu from "../../../../components/Sidemenu";
import { DataTable } from "../../../../components/ui/datatable";

const FeedbackComplaintsRating = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [feedbackData, setFeedbackData] = useState<any[]>([]);

  const toggleClass = () => {
    setIsToggled(!isToggled);
  };

  // Table column definitions
  const columns = {
    service_center_name: "Service Center Name",
    driver_name: "Driver Name",
    trip_id: "Trip ID",
    feedback: "Feedback",
    rating: "Rating",
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/feedbackRating/feedbackRatingList");
        const result = await response.json();

        if (result.data) {
        
          const formattedData = result.data.map((item: any) => ({
            service_center_name: item.service_center_name || "N/A",
            driver_name: item.driver_name || "N/A",
            trip_id: item.booking_id || "N/A",
            feedback: item.feedback || "No Feedback",
            rating: renderRatingStars(item.rating),
          }));

          setFeedbackData(formattedData);
        } else {
          console.error("Error fetching feedback data:", result.message);
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };

    fetchData();
  }, []);


  const renderRatingStars = (rating: number) => {
    const totalStars = 5;
    return (
      <div className="rating-images">
        {[...Array(totalStars)].map((_, index) => (
          <img
            key={index}
            src={
              index < rating
                ? "/images/fill-star.svg"
                : "/images/unfill-star.svg"
            }
            alt={`Star ${index + 1}`}
            className="img-fluid"
            style={{ width: "20px", marginRight: "5px" }}
          />
        ))}
      </div>
    );
  };

  return (
    <main className="Service_center_list_main">
      <Header />
      <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
        <div className="inner_left">
          <Sidemenu onToggle={toggleClass} />
        </div>
        <div className="inner_right">
          {/* Filter Box */}
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
              <form>
                <div className="inner_form_group">
                  <label htmlFor="service_center_name">Service Center Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="service_center_name"
                    id="service_center_name"
                  />
                </div>
                <div className="inner_form_group">
                  <label htmlFor="driver_name">Driver Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="driver_name"
                    id="driver_name"
                  />
                </div>
                <div className="inner_form_group">
                  <label htmlFor="trip_id">Trip ID</label>
                  <input
                    className="form-control"
                    type="text"
                    name="trip_id"
                    id="trip_id"
                  />
                </div>
                <div className="inner_form_group inner_form_group_submit">
                  <input type="submit" className="submite_btn" value="Search" />
                  <input type="button" className="close_btn" value="Export All" />
                  <div>
                    <input
                      type="button"
                      className="close_btn"
                      value="Clear"
                      // onClick={handleClearFilters} // Attach the handler here
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Data Listing */}
          <div className="data_listing_box mt-3">
            <div className="filter_heading_btnbox">
              <div className="service_form_heading">
                <span>
                  <img
                    src="/images/rating-list.svg"
                    alt=""
                    className="img-fluid"
                  />
                </span>
                Ratings & Feedback List
              </div>
            </div>
            <div className="filter_data_table">
              <DataTable columns={columns} data={feedbackData} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FeedbackComplaintsRating;
