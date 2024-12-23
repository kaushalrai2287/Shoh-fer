"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../../../../../components/Header";
import Sidemenu from "../../../../../components/Sidemenu";
import { DataTable } from "../../../../../components/ui/datatable";
import Link from "next/link";
import HeadingBredcrum from "../../../../../components/HeadingBredcrum";

interface Notification {
  driver_name: string;
  title: string;
  upload_document: string;
  message: string;
}

const NotificatioDriverlist = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [driverNameFilter, setDriverNameFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");

  const toggleClass = () => {
    setIsToggled(!isToggled);
  };

  const columns = {
    Driver_Name: "Driver Name",
    Title: "Title",
    Upload_Document: "Document",
    Message: "Message",
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/Notification/DriverList");
        const result = await response.json();
        if (response.ok) {
          setNotifications(result.data);
          setFilteredNotifications(result.data); // Initially display all data
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
    filterType: "driverName" | "title"
  ) => {
    const value = event.target.value;
    if (filterType === "driverName") {
      setDriverNameFilter(value);
    } else if (filterType === "title") {
      setTitleFilter(value);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const filtered = notifications.filter((notification) => {
      const matchesDriverName = notification.driver_name
        .toLowerCase()
        .includes(driverNameFilter.toLowerCase());
      const matchesTitle = notification.title
        .toLowerCase()
        .includes(titleFilter.toLowerCase());

      return matchesDriverName && matchesTitle;
    });

    setFilteredNotifications(filtered);
  };

  const handleClearFilters = () => {
    setDriverNameFilter("");
    setTitleFilter("");
    setFilteredNotifications(notifications); // Reset to show all data
  };

  const mappedData = filteredNotifications.map((notification) => ({
    Driver_Name: notification.driver_name,
    Title: notification.title,
    Upload_Document: notification.upload_document,
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
            heading="Driver Notification List"
            breadcrumbs={[
              { label: "Home", link: "/", active: false },
              { label: "Driver Notification List", active: true },
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
              <div className="filter_btn">
                <Link href="/notifications/driver/add">
                  <button className="submite_btn">Add</button>
                </Link>
              </div>
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="filter_formbox">
                <form onSubmit={handleSearchSubmit}>
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
                    <label htmlFor="title">Title</label>
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      id="title"
                      value={titleFilter}
                      onChange={(e) => handleFilterChange(e, "title")}
                    />
                  </div>
                  <div className="inner_form_group inner_form_group_submit">
                    <input
                      type="submit"
                      className="submite_btn"
                      value="Search"
                    />
                    <input
                      type="button"
                      className="close_btn"
                      value="Clear"
                      onClick={handleClearFilters}
                    />
                  </div>
                </form>
              </div>
            )}
          </div>
          <div className="data_listing_box mt-3">
            <div className="filter_heading_btnbox">
              <div className="service_form_heading">
                <span>
                  <img
                    src="/images/driver-list.svg"
                    alt=""
                    className="img-fluid"
                  />
                </span>
                Driver Notification List
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

export default NotificatioDriverlist;
