// final code
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../../../../components/Header";
import Sidemenu from "../../../../components/Sidemenu";
import { DataTable } from "../../../../components/ui/datatable";
import Link from "next/link";
import { CSVLink } from "react-csv";

const InvoceService = () => {
  const [isToggled, setIsToggled] = useState(false); // State for toggle
  const [serviceCenterInvoices, setServiceCenterInvoices] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    service_center_name: "",
    start_date: "",
    end_date: "",
    status: "",
  });

  const toggleClass = () => {
    setIsToggled(!isToggled); // Toggle the state
  };

  const columns = {
    Service_Center_Name: "Service Center Name",
    Driver_Name: "Driver Name",
    Trip_Id: "Trip Id",
    Trip_Status: "Trip Status",
    Date: "Date",
    Cost: "Cost",
    Status: "Status", // Add Status to columns
  };

  const hiddenColumns = [];
  const fetchInvoices = async () => {
    try {
      const params = new URLSearchParams();
  
      // Only append non-empty filters
      if (filters.service_center_name.trim()) {
        params.append("service_center_name", filters.service_center_name);
      }
      if (filters.start_date.trim()) {
        params.append("start_date", filters.start_date);
      }
      if (filters.end_date.trim()) {
        params.append("end_date", filters.end_date);
      }
      if (filters.status.trim()) {
        params.append("status", filters.status);
      }
  
      const response = await fetch(
        `/api/invoices/ServiceCenterInvoices?${params.toString()}`
      );
  
      const result = await response.json();
  
      if (result.data) {
        const formattedData = result.data.map((item: any) => ({
          Service_Center_Name: item.service_center_name || "N/A",
          Driver_Name: item.driver_name || "N/A",
          Trip_Id: item.booking_id || "N/A",
          Date: item.payment_date,
          Cost: item.total_amount,
          Status: item.is_paid ? "Paid" : "Pending",
        }));
  
        setServiceCenterInvoices(formattedData);
      } else {
        console.error("Error fetching invoices data:", result.message);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  
//   const fetchInvoices = async () => {
//     try {
//       const params = new URLSearchParams();

//       // Append filters to query string
//       if (filters.service_center_name) {
//         params.append("service_center_name", filters.service_center_name);
//       }
//       if (filters.start_date) {
//         params.append("start_date", filters.start_date);
//       }
//       if (filters.end_date) {
//         params.append("end_date", filters.end_date);
//       }

//       const response = await fetch(
//         `/api/invoices/ServiceCenterInvoices?${params.toString()}`
//       );
//       const result = await response.json();

//       if (result.data) {
//         const formattedData = result.data.map((item: any) => ({
//           Service_Center_Name: item.service_center_name || "N/A",
//           Driver_Name: item.driver_name || "N/A",
//           Trip_Id: item.booking_id || "N/A",
//           Date: item.payment_date,
//           Cost: item.total_amount,
//           Status: item.is_paid ? "Paid" : "Pending",
//         }));

//         setServiceCenterInvoices(formattedData);
//       } else {
//         console.error("Error fetching invoices data:", result.message);
//       }
//     } catch (error) {
//       console.error("Error calling API:", error);
//     }
//   };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoices();
  };
  const exportData = () => {
    return serviceCenterInvoices.map((invoice) => ({
      "Service Center Name": invoice.Service_Center_Name,
      "Driver Name": invoice.Driver_Name,
      "Trip Id": invoice.Trip_Id,
      "Trip Status": invoice.Status,
      Date: invoice.Date,
      Cost: invoice.Cost,
      Status: invoice.Status,
    }));
  };
  const handleClearFilters = () => {
    setFilters({
      service_center_name: "",
      start_date: "",
      end_date: "",
      status: "",
    });
    fetchInvoices(); 
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
                  <label htmlFor="service_center_name">Service Center</label>
                  <input
                    className="form-control"
                    type="text"
                    name="service_center_name"
                    id="service_center_name"
                    value={filters.service_center_name}
                    onChange={handleFilterChange}
                    placeholder="Enter Service Center Name"
                  />
                </div>
                <div className="inner_form_group">
                  <label htmlFor="status">Status</label>
                  <select
                    className="form-control"
                    name="status"
                    id="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">Select Status</option>
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
                    value={filters.start_date}
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
                    value={filters.end_date}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="inner_form_group inner_form_group_submit">
                  <input type="submit" className="submite_btn" value="Search" />
                  <CSVLink
                    data={exportData()}
                    filename={"service_center_invoices.csv"}
                    className="close_btn"
                    target="_blank"
                  >
                    Export All
                  </CSVLink>

                  <div>
                    <input
                      type="button"
                      className="close_btn"
                      value="Clear"
                      onClick={handleClearFilters} // Attach the handler here
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
                    src="/images/bars-sort.svg"
                    alt=""
                    className="img-fluid"
                  />
                </span>
                Service Center Invoices List
              </div>
            </div>
            <div className="filter_data_table">
              <DataTable
                columns={columns}
                data={serviceCenterInvoices}
                showStatusButton={true}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InvoceService;
