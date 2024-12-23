"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from '../../../../../components/Header';
import Sidemenu from "../../../../../components/Sidemenu";
import { DataTable } from "../../../../../components/ui/datatable";
import Link from "next/link";
import HeadingBredcrum from "../../../../../components/HeadingBredcrum";

interface Notification {
  servicecenter_name: string;
  title: string;
  doc_url: string;
  message: string;
}

const NotificatioServicecenterlist = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceCenterFilter, setServiceCenterFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");

  const toggleClass = () => {
    setIsToggled(!isToggled);
  };

  const columns = {
    Service_Center_Name: "Service Center Name",
    Title: "Title",
    Upload_Document: "Document",
    Message: "Message",
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/Notification/ServiceCenterList");
        const result = await response.json();
        if (response.ok) {
          setNotifications(result.data);
          // console.log(result.data);
          setFilteredNotifications(result.data); 
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);
  

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    filterType: "serviceCenter" | "title"
  ) => {
    const value = event.target.value;
    if (filterType === "serviceCenter") {
      setServiceCenterFilter(value);
    } else if (filterType === "title") {
      setTitleFilter(value);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // const filtered = notifications.filter((notification) => {
    //   const matchesServiceCenter = notification.servicecenter_name
    //     .toLowerCase()
    //     .includes(serviceCenterFilter.toLowerCase());
    //   const matchesTitle = notification.title
    //     .toLowerCase()
    //     .includes(titleFilter.toLowerCase());

    //   return matchesServiceCenter && matchesTitle;
    // });

    const filtered = notifications.filter((notification) => {
        const matchesServiceCenter = (notification.servicecenter_name || "")
          .toLowerCase()
          .includes(serviceCenterFilter.toLowerCase());
        const matchesTitle = (notification.title || "")
          .toLowerCase()
          .includes(titleFilter.toLowerCase());
      
        return matchesServiceCenter && matchesTitle;
      });
      

    setFilteredNotifications(filtered);
  };

  const handleClearFilters = () => {
    setServiceCenterFilter("");
    setTitleFilter("");
    setFilteredNotifications(notifications); // Reset to show all data
  };

  const mappedData = filteredNotifications.map((notification) => ({
    Service_Center_Name: notification.servicecenter_name,
    Title: notification.title,
    // Upload_Document: notification.doc_url,
    Upload_Document: (
      <a
        href={notification.doc_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#007bff",
          textDecoration: "underline",
        }}
      >
        View Document
      </a>
    ),
    Message: notification.message,
  }));

  const hiddenColumns = [];

  return (
    <main className="Service_center_list_main">
      <Header />
      <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
        <div className="inner_left">
          <Sidemenu onToggle={toggleClass} />
        </div>
        <div className="inner_right">
        <HeadingBredcrum
            heading="Service Center Notification List"
            breadcrumbs={[
              { label: "Home", link: "/", active: false },
              { label: "Service Center Notification List", active: true },
            ]}
          />
          <div className="filter_box">
            <div className="filter_heading_btnbox">
              <div className="service_form_heading">
                <span>
                  <img src="/images/settings-sliders.svg" alt="" className="img-fluid" />
                </span>
                Filter By
              </div>
              <div className="filter_btn">
                <Link href="/notifications/service-center/add">
                  <button className="submite_btn">Add</button>
                </Link>
              </div>
            </div>
            <div className="filter_formbox">
              <form onSubmit={handleSearchSubmit}>
                <div className="inner_form_group">
                  <label htmlFor="search_service_name">Service Center Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="search_service_name"
                    id="search_service_name"
                    value={serviceCenterFilter}
                    onChange={(e) => handleFilterChange(e, "serviceCenter")}
                  />
                </div>
                <div className="inner_form_group">
                  <label htmlFor="search_service_area">Title</label>
                  <input
                    className="form-control"
                    type="text"
                    name="search_service_area"
                    id="search_service_area"
                    value={titleFilter}
                    onChange={(e) => handleFilterChange(e, "title")}
                  />
                </div>
                <div className="inner_form_group inner_form_group_submit">
                  <input type="submit" className='submite_btn' value="Search" />
                  <input type="button" className='close_btn' value="Clear" onClick={handleClearFilters} />
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
                Service Center Notification List
              </div>
            </div>
            <div className="filter_data_table">
              <DataTable columns={columns} data={mappedData} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotificatioServicecenterlist;
