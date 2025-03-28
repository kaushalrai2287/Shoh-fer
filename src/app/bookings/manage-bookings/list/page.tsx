"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../../../../../components/Header";
import Sidemenu from "../../../../../components/Sidemenu";
import { DataTable } from "../../../../../components/ui/datatable";
import Link from "next/link";
import { createClient } from "../../../../../utils/supabase/client";
import router, { useRouter } from "next/navigation";
import HeadingBredcrum from "../../../../../components/HeadingBredcrum";
import { CSVLink } from "react-csv";

// Supabase client initialization
const supabase = createClient();

interface Booking {
  booking_id: string;
  vehicles: any;
  drivers: any;
  service_centers: any;
  // service_center_id: string;
  // driver_id: string;
  customer_name: string;
  customer_phone: string;
  pickup_address: string;
  dropoff_address: string;
  // vehicle_id: string;
  driver_rating: number;
  Invoice_url:string;
  status: string;
  created_at: string | Date; // Add this li

  // vehicle: Vehicle;
}

const ListBooking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isToggled, setIsToggled] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const [driverNameQuery, setDriverNameQuery] = useState(""); // Driver name search
  const toggleClass = () => {
    setIsToggled(!isToggled);
  };

  const columns = {
    Service_Center_Name: "Service Center Name",
    Driver_Name: "Driver Name",
   
    Trip_Id:"Trip Id",
  
    Brand: "Brand",
    Model: "Model",
    Customer_Name: "Customer Name",
    Tracking_link: "Tracking",
    Customer_Phone_Number: "Customer Phone Number",
    Vehicle_Number: "Vehicle Number",
    Vehicle_Condition: "Vehicle Condition",
    Pick_Up_Location: "Pick Up Location",
    Drop_Location: "Drop Location",
    Previous_Experince: "Previous Experience",
    Invoice:"Invoice",
    // Driver_Rating: "Driver Rating",
    Status: "Status",
    // Booking: "Booking",
  };

  const hiddenColumns = [
   
    "Trip_Id",
   
    "Brand",
    "Model",
    "Customer_Name",
   
    "Customer_Phone_Number",
    "Tracking_link",
    "Vehicle_Number",
    "Vehicle_Condition",
    "Pick_Up_Location",
    "Drop_Location",
    "Previous_Experince",
    "Invoice",
    // "Driver_Rating",
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);

      let query = supabase.from("bookings").select(`
            *, created_at, service_centers(*), drivers(*), vehicles(*, brands(*), models(*))
          `);

      if (dateFilter) {
        query = query
          .gte("created_at", `${dateFilter}T00:00:00Z`)
          .lte("created_at", `${dateFilter}T23:59:59Z`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching bookings:", error.message);
      } else {
        setBookings(data);
      }

      setLoading(false);
    };

    fetchBookings();
  }, []);
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "service" | "driver"
  ) => {
    if (type === "service") {
      setSearchQuery(event.target.value);
    } else {
      setDriverNameQuery(event.target.value);
    }
  };

  // Filter bookings based on service center name and driver name
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const filteredBookings = bookings.filter((booking) => {
      const serviceCenterName = booking.service_centers?.name || "";
      const driverName = booking.drivers?.driver_name || "";

      return (
        serviceCenterName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        driverName.toLowerCase().includes(driverNameQuery.toLowerCase())
      );
    });

    setBookings(filteredBookings);
    setLoading(false);
  };

  type StatusType = "pending" |"active" |"accepted" | "completed" | "canceled"|"rejected";

  // const handleDelete = async (bookingId: string) => {
  //   if (window.confirm("Are you sure you want to delete this booking?")) {
  //     const { error } = await supabase
  //       .from("bookings")
  //       .delete()
  //       .eq("booking_id", bookingId);

  //     if (error) {
  //       console.error("Error deleting booking:", error.message);
  //     } else {
  //       // Remove the deleted booking from local state
  //       setBookings((prevBookings) =>
  //         prevBookings.filter((booking) => booking.booking_id !== bookingId)
  //       );
  //     }
  //   }
  // };
  const router = useRouter();

  const handleEdit = (bookingId: string) => {
    router.push(`/bookings/manage-bookings/edit/${bookingId}`);
  };

  const handleStatusUpdate = async (
    bookingId: string,
    currentStatus: string
  ) => {
    // Show confirmation popup
    const isConfirmed = window.confirm(
      `Are you sure you want to change the status for this booking?`
    );

    if (!isConfirmed) {
      return; // Exit if user cancels
    }

   
    const statusCycle: Record<StatusType, StatusType> = {
      pending: "pending",
      active: "active",
      accepted: "accepted",
      completed: "completed",
      canceled: "canceled",
      rejected: "rejected",
    };


    const lowerCaseStatus = currentStatus.toLowerCase() as StatusType;
    const newStatus = statusCycle[lowerCaseStatus] || "pending";

    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus }) // Use correct ENUM value
      .eq("booking_id", bookingId);

    if (error) {
      console.error("Error updating status:", error.message);
    } else {
      // Update local state for immediate UI feedback
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.booking_id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
    }
  };


  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(event.target.value);
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase(); // Normalize status to lowercase
    switch (normalizedStatus) {
      case "pending":
        return "orange";
      case "rejected":
        return "red";
      case "active":
        return "green";
      case "completed":
        return "green";
      case "accepted":
        return "blue"; // Optional: Add custom color for "accepted" status
      case "canceled":
        return "red";
      default:
        return "gray"; // Default case if status doesn't match
    }
  };
  const handleClear = async () => {
    setSearchQuery("");
    setDriverNameQuery("");
    setLoading(true);

    // Fetch original bookings again
    const { data, error } = await supabase.from("bookings").select(`
        *, service_centers(*), drivers(*), vehicles(*, brands(*), models(*))
    `);

    if (error) {
      console.error("Error fetching bookings:", error.message);
    } else {
      setBookings(data);
    }

    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  const mappedData = bookings.map((booking) => ({
    Service_Center_Name: booking.service_centers?.name || "Unknown",
    Driver_Name: booking.drivers?.driver_name,
    Tracking_link: (
      <button
        onClick={() => {
          window.open(
            "https://www.google.com/maps", // Replace with your tracking URL dynamically
            "TrackingWindow",
            "width=600,height=400,left=100,top=100"
          );
        }}
        style={{
          display: "inline-block",
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "4px 9px",
          fontSize: "11px",
          fontWeight: "bold",
          borderRadius: "4px",
          textDecoration: "none",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        Track Status
      </button>
    ),
    
    
    Brand: booking.vehicles.brands?.name || "Unknown",
    Model: booking.vehicles.models?.name || "Unknown",
    Customer_Name: booking.customer_name,
    Customer_Phone_Number: booking.customer_phone,
    Vehicle_Number: booking.vehicles?.license_plate_no || "Unknown",
    Vehicle_Condition: booking.vehicles?.condition || "Unknown",
    Pick_Up_Location: booking.pickup_address,
    Drop_Location: booking.dropoff_address,
    Previous_Experince: "3 years",
    Driver_Rating: booking.driver_rating || "N/A",
    Trip_Id: booking.booking_id,
    Invoice: (
      <a
        href={booking.Invoice_url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          backgroundColor: "#28a745", // Green color for invoice button
          color: "#fff",
          padding: "4px 9px",
          fontSize: "11px",
          fontWeight: "bold",
          borderRadius: "4px",
          textDecoration: "none",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        View Invoice
      </a>
    ),
    Status: (
      <select
        value={booking.status}
        onChange={async (e) => {
          const newStatus = e.target.value; // Get selected status
          await handleStatusUpdate(booking.booking_id, newStatus); // Pass booking ID and new status
        }}
        style={{
          cursor: "pointer",
          color: getStatusColor(booking.status),
          fontWeight: "bold",
        }}
      >
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
        <option value="active">Active</option>
        <option value="accepted">Accepted</option>
        <option value="completed">Completed</option>
        <option value="canceled">Canceled</option>
      </select>
    ),
    Booking: "Cancel Booking",
    onEdit: () => handleEdit(booking.booking_id),
    // onDelete: () => handleDelete(booking.booking_id),
}));

  return (
    <main className="Service_center_list_main">
      <Header />
      <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
        <div className="inner_left">
          <Sidemenu onToggle={toggleClass} />
        </div>
        <div className="inner_right">
          <HeadingBredcrum
            heading="Booking List"
            breadcrumbs={[
              { label: "Home", link: "/", active: false },
              { label: "Booking List", active: true },
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
                <Link href="/bookings/manage-bookings/add">
                  <button className="submite_btn">Add</button>
                </Link>
              </div>
            </div>
            <div className="filter_formbox">
              <form onSubmit={handleSearchSubmit}>
                <div className="inner_form_group">
                  <label htmlFor="search_service_name">
                    Service Center Name
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="search_service_name"
                    id="search_service_name"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e, "service")}
                  />
                </div>
                <div className="inner_form_group">
                  <label htmlFor="driver_name">Driver Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="driver_name"
                    id="driver_name"
                    value={driverNameQuery}
                    onChange={(e) => handleSearchChange(e, "driver")}
                  />
                </div>
                <div className="inner_form_group">
                  <label htmlFor="date">Date</label>
                  <input
                    className="form-control"
                    type="date"
                    name="date"
                    id="date"
                    value={dateFilter || ""}
                    onChange={handleDateChange}
                  />
                </div>
                <div className="inner_form_group inner_form_group_submit">
                  <input type="submit" className="submite_btn" value="Search" />
                  <CSVLink
                    data={mappedData} // Pass the mapped data for export
                    filename="bookings_data.csv" // Specify filename for export
                  >
                    <input
                      type="button"
                      className="close_btn"
                      value="Export All"
                    />
                  </CSVLink>
                  <div>
                    <input
                      type="button"
                      className="close_btn"
                      value="Clear"
                      onClick={handleClear} // Attach the handler here
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
                Booking List
              </div>
            </div>
            <div className="filter_data_table">
              <DataTable
                columns={columns}
                data={mappedData}
                hiddenColumns={hiddenColumns}
                showStatusButton={true}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ListBooking;
