"use client";
import React, { useState, useEffect } from "react";
import Header from "../../../../components/Header";
import Sidemenu from "../../../../components/Sidemenu";
import { DataTable } from "../../../../components/ui/datatable";
import { CSVLink } from "react-csv";
import HeadingBredcrum from "../../../../components/HeadingBredcrum";

const FeedbackComplaintsRating = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [feedbackData, setFeedbackData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [serviceCenterFilter, setServiceCenterFilter] = useState("");
  const [driverNameFilter, setDriverNameFilter] = useState("");
  const [tripIdFilter, setTripIdFilter] = useState("");

  const toggleClass = () => {
    setIsToggled(!isToggled);
  };

  const columns = {
    service_center_name: "Service Center Name",
    driver_name: "Driver Name",
    trip_id: "Trip ID",
    feedback: "Feedback",
    rating: "Rating",
  };

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
          setFilteredData(formattedData); // Initially display all data
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

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    filterType: "serviceCenter" | "driverName" | "tripId"
  ) => {
    const value = event.target.value;
    if (filterType === "serviceCenter") {
      setServiceCenterFilter(value);
    } else if (filterType === "driverName") {
      setDriverNameFilter(value);
    } else if (filterType === "tripId") {
      setTripIdFilter(value);
    }
  };

  const handleClearFilters = () => {
    setServiceCenterFilter("");
    setDriverNameFilter("");
    setTripIdFilter("");
    setFilteredData(feedbackData); // Reset to show all data
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const filtered = feedbackData.filter((item: any) => {
      const matchesServiceCenter = item.service_center_name
        .toLowerCase()
        .includes(serviceCenterFilter.toLowerCase());
      const matchesDriverName = item.driver_name
        .toLowerCase()
        .includes(driverNameFilter.toLowerCase());
      const matchesTripId = String(item.trip_id) // Convert trip_id to a string
        .toLowerCase()
        .includes(tripIdFilter.toLowerCase());

      return matchesServiceCenter && matchesDriverName && matchesTripId;
    });

    setFilteredData(filtered);
  };

  const csvHeaders = [
    { label: "Service Center Name", key: "service_center_name" },
    { label: "Driver Name", key: "driver_name" },
    { label: "Trip ID", key: "trip_id" },
    { label: "Feedback", key: "feedback" },
    { label: "Rating", key: "rating" },
  ];

  return (
    <main className="Service_center_list_main">
      <Header />
      <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
        <div className="inner_left">
          <Sidemenu onToggle={toggleClass} />
        </div>
        <div className="inner_right">
        <HeadingBredcrum
            heading="Rating Reviews Feedback"
            breadcrumbs={[
              { label: "Home", link: "/", active: false },
              { label: "Rating Reviews Feedback List", active: true },
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
              <form onSubmit={handleSearchSubmit}>
                <div className="inner_form_group">
                  <label htmlFor="service_center_name">
                    Service Center Name
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="service_center_name"
                    id="service_center_name"
                    value={serviceCenterFilter}
                    onChange={(e) => handleFilterChange(e, "serviceCenter")}
                  />
                </div>
                <div className="inner_form_group">
                  <label htmlFor="driver_name">Driver Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="driver_name"
                    id="driver_name"
                    value={driverNameFilter}
                    onChange={(e) => handleFilterChange(e, "driverName")}
                  />
                </div>
                <div className="inner_form_group">
                  <label htmlFor="trip_id">Trip ID</label>
                  <input
                    className="form-control"
                    type="text"
                    name="trip_id"
                    id="trip_id"
                    value={tripIdFilter}
                    onChange={(e) => handleFilterChange(e, "tripId")}
                  />
                </div>
                <div className="inner_form_group inner_form_group_submit">
                  <input type="submit" className="submite_btn" value="Search" />

                  <CSVLink
                    data={filteredData}
                    headers={csvHeaders}
                    filename={"feedback_complaints_rating.csv"}
                    className="close_btn"
                  >
                    Export All
                  </CSVLink>
                  <div>
                    <input
                      type="button"
                      className="close_btn"
                      value="Clear"
                      onClick={handleClearFilters}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

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
              <DataTable columns={columns} data={filteredData} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FeedbackComplaintsRating;
