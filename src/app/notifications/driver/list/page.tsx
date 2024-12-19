// final code
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../../../../../components/Header";
import Sidemenu from "../../../../../components/Sidemenu";
import { DataTable } from "../../../../../components/ui/datatable";
import Link from "next/link";

interface Notification {
  driver_name: string;
  title: string;
  upload_document: string;
  message: string;
}
const NotificatioDriverlist = () => {
  const [isToggled, setIsToggled] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        console.log(result);
        if (response.ok) {
          setNotifications(result.data);
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
  const mappedData = notifications.map((notification) => ({
    Driver_Name: notification.driver_name,
    Title: notification.title,
    Upload_Document: notification.upload_document, // This will be hidden
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

            {/* Loading indicator inside the form */}
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="filter_formbox">
                <form action="">
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
                    <label htmlFor="search_service_area">Title</label>
                    <input
                      className="form-control"
                      type="text"
                      name="search_service_area"
                      id="search_service_area"
                    />
                  </div>
                  <div className="inner_form_group inner_form_group_submit">
                    <input
                      type="submit"
                      className="submite_btn"
                      value="Search"
                    />
                    <input
                      type="submit"
                      className="close_btn"
                      value="Export All"
                    />
                    <div>
                      <input
                        type="button"
                        className="close_btn"
                        value="Clear"
                        //   onClick={handleClearFilters} // Attach the handler here
                      />
                    </div>
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
