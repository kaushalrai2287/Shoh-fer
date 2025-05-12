
"use client";
import React, { useEffect, useState } from "react";
import Header from "../../../../components/Header";
import Sidemenu from "../../../../components/Sidemenu";
import { DataTable } from "../../../../components/ui/datatable";
import { createClient } from "../../../../utils/supabase/client";
import HeadingBredcrum from "../../../../components/HeadingBredcrum";
import { format } from "date-fns";
import { CSVLink } from "react-csv";

const supabase = createClient();

interface FeedbackComplaint {
  type_of_complaints: string;
  raised_by: string;
  raised_for: string;
  // trip_id: string;
  actual_booking_id: string;
  complaint_box: string;
  request: string;
  created_at: string;
  comments: string;
}

const FeedbackComplaints = () => {
  const [isToggled, setIsToggled] = useState(false); 
  const [data, setData] = useState<FeedbackComplaint[]>([]);
  const [filteredData, setFilteredData] = useState<FeedbackComplaint[]>([]); 
  const [filters, setFilters] = useState({
    actual_booking_id: "",
    request: "",
  });

  const toggleClass = () => {
    setIsToggled(!isToggled); 
  };

  const columns = {
    Type_Of_Complaints: "Complaints By (Service Center/Driver)",
    Raised_by: "Raised By",
    Raised_For: "Raised For",
    actual_booking_id: "Booking ID",
    Complaint_Box: "Complaint Box",
    Request: "Request",
    Date_And_Time: "Date and Time of Request Raised",
    Comments: "Resolution Comments",
  };

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("feedback_complaints")
      .select("*").order("created_at", { ascending: true });;

    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      setData(data as FeedbackComplaint[]);
      setFilteredData(data.filter(item => item.request === "Pending") as FeedbackComplaint[]);
      // setFilteredData(data as FeedbackComplaint[]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

 
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "green";
      case "Pending":
        return "orange";
      default:
        return "black";
    }
  };

  // Function to handle status (Request) update
  // const handleRequestUpdate = async (tripId: string, newStatus: string) => {
  //   const isConfirmed = window.confirm(
  //     `Are you sure you want to change the status to ${newStatus}?`
  //   );

  //   if (!isConfirmed) return;

  //   const { error } = await supabase
  //     .from("feedback_complaints")
  //     .update({ request: newStatus })
  //     .eq("trip_id", tripId);

  //   if (error) {
  //     console.error("Error updating status:", error.message);
  //   } else {
  //     // Re-fetch data to update the UI
  //     fetchData();
  //   }
  // };

  

  // const handleRequestUpdate = async (



  //   tripId: string,
  //   newStatus: string,
  //   comments: string
  // ) => {


  //   // if (newStatus === "Resolved" && !comments.trim()) {
  //   //   alert("Resolution comments are required to resolve the complaint.");
  //   //   return;
  //   // }
  
  //   const isConfirmed = window.confirm(
  //     `Are you sure you want to change the status to ${newStatus}?`
  //   );

  //   if (!isConfirmed) return;

  //   const { error } = await supabase
  //     .from("feedback_complaints")
  //     .update({
  //       request: newStatus,
  //       comments: newStatus === "Resolved" ? comments : null, 
  //     })
  //     .eq("trip_id", tripId);

  //   if (error) {
  //     console.error("Error updating status:", error.message);
  //   } else {
  //     fetchData();
  //   }
  // };


  const handleRequestUpdate = async (actual_booking_id: string, newStatus: string, comments: string) => {
    if (newStatus === "Resolved" && !comments.trim()) {
      alert("Resolution comments are required to resolve the complaint.");
      return;
    }
  
    const isConfirmed = window.confirm(
      `Are you sure you want to change the status to ${newStatus}?`
    );
  
    if (!isConfirmed) return;
  
    const { error } = await supabase
      .from("feedback_complaints")
      .update({
        request: newStatus,
        comments: newStatus === "Resolved" ? comments : null, // Save comments only if resolved
      })
      .eq("actual_booking_id",actual_booking_id );
  
    if (error) {
      console.error("Error updating status:", error.message);
    } else {
      fetchData(); // Re-fetch data to update the UI
    }
  };
  
  // const handleCommentChange = (tripId: string, comment: string) => {
  //   const updatedData = filteredData.map((item) =>
  //     item.trip_id === tripId ? { ...item, comments: comment } : item
  //   );
  //   setFilteredData(updatedData); 
  // };
  const handleCommentChange = async (actual_booking_id: string, comment: string) => {
  
    const updatedData = filteredData.map((item) =>
      item.actual_booking_id === actual_booking_id ? { ...item, comments: comment } : item
    );
    setFilteredData(updatedData);
  
  
    const { error } = await supabase
      .from("feedback_complaints")
      .update({ comments: comment })
      .eq("actual_booking_id", actual_booking_id);
  
    if (error) {
      console.error("Error updating comments:", error.message);
    } else {
      console.log("Comments updated successfully");
    }
  };
  

  const applyFilters = () => {
    let filtered = [...data]; 

    if (filters.actual_booking_id) {
      filtered = filtered.filter(
        (item) =>
          item.actual_booking_id
            .toString()
            .toLowerCase()
            .includes(filters.actual_booking_id.toLowerCase()) 
      );
    }

    if (filters.request) {
      filtered = filtered.filter((item) =>
        item.request.toLowerCase().includes(filters.request.toLowerCase())
      );
    }

    setFilteredData(filtered); // Update filteredData state
  };

  // Mapping data to match columns and render the Request status
  const mappedData = filteredData.map((item) => ({
    Type_Of_Complaints: item.type_of_complaints,
    Raised_by: item.raised_by,
    Raised_For: item.raised_for,
    actual_booking_id: item.actual_booking_id, 
    Complaint_Box: item.complaint_box,
    Request: (
      <select
        value={item.request}
        onChange={(e) =>
          handleRequestUpdate(item.actual_booking_id, e.target.value, item.comments || "")
        } 
        style={{
          cursor: "pointer",
          color: getStatusColor(item.request), 
          fontWeight: "bold",
        }}
      >
        <option value="Pending">Pending</option>
        <option value="Resolved">Resolved</option>
      </select>
    ),
    Date_And_Time: format(new Date(item.created_at), "dd/MM/yyyy HH:mm:ss"),

    Comments:
      item.request === "Pending" ? (
        <textarea
          value={item.comments || ""}
          onChange={(e) => handleCommentChange(item.actual_booking_id, e.target.value)} 
          placeholder="Enter resolution comments..."
          style={{ width: "200px", height: "50px" }}
        />
      ) : (
        <span>{item.comments || "No comments yet"}</span>
      ),
  }));
  // Handle filter changes
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

 
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(); 
  };

  const csvData = filteredData.map((item) => ({
    "Complaints For": item.type_of_complaints,
    "Raised By": item.raised_by,
    "Raised For": item.raised_for,
    "Booking ID": item.actual_booking_id,
    "Complaint Box": item.complaint_box,
    Request: item.request,
    "Date and Time": format(new Date(item.created_at), "dd/MM/yyyy HH:mm:ss"),
    "Resolution Comments": item.comments || "No comments yet",
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
            heading="Complaints"
            breadcrumbs={[
              { label: "Home", link: "/", active: false },
              { label: "Complaints List", active: true },
            ]}
          />
          <div className="filter_box">
            <div className="filter_heading_btnbox">
              <div className="service_form_heading">
                <span>
                  <img
                    src="/images/settings-sliders.svg"
                    alt="Filter"
                    className="img-fluid"
                  />
                </span>
                Filter By
              </div>
            </div>
            <div className="filter_formbox">
              <form onSubmit={handleFormSubmit}>
                <div className="inner_form_group">
                  <label htmlFor="actual_booking_id">Booking ID</label>
                  <input
                    className="form-control"
                    type="text"
                    name="actual_booking_id"
                    id="actual_booking_id"
                    value={filters.actual_booking_id}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="inner_form_group">
                  <label htmlFor="Status">Request</label>
                  <select
                    className="form-control"
                    name="request"
                    id="Status"
                    value={filters.request}
                    onChange={handleFilterChange}
                  >
                    <option value="">Select Request</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="inner_form_group inner_form_group_submit">
                  <input type="submit" className="submite_btn" value="Search" />

                  <CSVLink
                    data={csvData}
                    filename="ListOfComplaints.csv"
                    className="close_btn"
                  >
                    Export All
                  </CSVLink>

                  <button
                    type="button"
                    className="close_btn"
                    onClick={() => {
                      setFilters({ actual_booking_id: "", request: "" });
                      setFilteredData(data); 
                    }}
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
                    src="/images/rating-list.svg"
                    alt="List"
                    className="img-fluid"
                  />
                </span>
                Ratings & Feedback List
              </div>
            </div>
            <div className="filter_data_table">
              <DataTable
                columns={columns}
                data={mappedData} 
                showRequestButton={true}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FeedbackComplaints;
