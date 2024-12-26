// // final code
// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import Header from "../../../../components/Header";
// import Sidemenu from "../../../../components/Sidemenu";
// import { DataTable } from "../../../../components/ui/datatable";
// import Link from "next/link";

// const FeedbackComplaints = () => {
//   const [isToggled, setIsToggled] = useState(false); // State for toggle

//   const toggleClass = () => {
//     setIsToggled(!isToggled); // Toggle the state
//   };

//   const columns = {
//     Raised_by: "Raised By",
//     Raised_For: "Raised For",
//     Trip_id: "Trip ID",
//     Complaint_Box: "Complaint Box",
//     Request: "Request",
//   };

//   const data = [
//     {
//       Raised_by: "ABC Servicing",
//       Raised_For: "Rahul",
//       Trip_id: "45",
//       Complaint_Box: '"Lorem ipsum dolor sit amet"',
//       Request: "Approved",
//       editLink: "#", // Edit page link
//       deleteLink: "#", // Delete page link
//     },
//   ];

//   return (
//     <main className="Service_center_list_main">
//       <Header />
//       <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
//         <div className="inner_left">
//           <Sidemenu onToggle={toggleClass} />
//         </div>
//         <div className="inner_right">
//           <div className="filter_box">
//             <div className="filter_heading_btnbox">
//               <div className="service_form_heading">
//                 <span>
//                   <img
//                     src="/images/settings-sliders.svg"
//                     alt=""
//                     className="img-fluid"
//                   />
//                 </span>
//                 Filter By
//               </div>
//             </div>
//             <div className="filter_formbox">
//               <form action="">
//                 <div className="inner_form_group">
//                   <label htmlFor="trip_id">Trip ID</label>
//                   <input
//                     className="form-control"
//                     type="text"
//                     name="trip_id"
//                     id="trip_id"
//                   />
//                 </div>
//                 <div className="inner_form_group">
//                   <label htmlFor="Status">Request</label>
//                   <select className="form-control" name="Status" id="Status">
//                     <option value="">Select Request</option>
//                     <option value="Approved">Approved</option>
//                     <option value="Reject">Reject</option>
//                   </select>
//                   <div className="down_arrow_btn">
//                     <img
//                       src="/images/angle-small-down.svg"
//                       alt=""
//                       className="img-fluid"
//                     />
//                   </div>
//                 </div>
//                 <div className="inner_form_group inner_form_group_submit">
//                   <input type="submit" className="submite_btn" value="Search" />
//                   <input
//                     type="submit"
//                     className="close_btn"
//                     value="Export All"
//                   />
//                   <div>
//                     <input
//                       type="button"
//                       className="close_btn"
//                       value="Clear"
//                       //   onClick={handleClearFilters} // Attach the handler here
//                     />
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//           <div className="data_listing_box mt-3">
//             <div className="filter_heading_btnbox">
//               <div className="service_form_heading">
//                 <span>
//                   <img
//                     src="/images/rating-list.svg"
//                     alt=""
//                     className="img-fluid"
//                   />
//                 </span>
//                 Ratings & Feedback List
//               </div>
//             </div>
//             <div className="filter_data_table">
//               <DataTable
//                 columns={columns}
//                 data={data}
//                 showRequestButton={true}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default FeedbackComplaints;
"use client";
import React, { useEffect, useState } from "react";
import Header from "../../../../components/Header";
import Sidemenu from "../../../../components/Sidemenu";
import { DataTable } from "../../../../components/ui/datatable";
import { createClient } from "../../../../utils/supabase/client";
import HeadingBredcrum from "../../../../components/HeadingBredcrum";

const supabase = createClient();

interface FeedbackComplaint {
  Type_of_complaints:string;
  raised_by: string;
  raised_for: string;
  trip_id: string;
  complaint_box: string;
  request: string;
}

const FeedbackComplaints = () => {
  const [isToggled, setIsToggled] = useState(false); // State for toggle
  const [data, setData] = useState<FeedbackComplaint[]>([]);
  const [filteredData, setFilteredData] = useState<FeedbackComplaint[]>([]); // New state for filtered data
  const [filters, setFilters] = useState({
    trip_id: "",
    request: "",
  });

  const toggleClass = () => {
    setIsToggled(!isToggled); // Toggle the state
  };

  const columns = {
    Type_Of_Complaints:"Complaints For",
    Raised_by: "Raised By",
    Raised_For: "Raised For",
    Trip_id: "Trip ID",
    Complaint_Box: "Complaint Box",
    Request: "Request",
  };

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("feedback_complaints")
      .select("*");

    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      setData(data as FeedbackComplaint[]);
      setFilteredData(data as FeedbackComplaint[]); // Set both data and filteredData initially
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to get the color for the status (Request)
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
  const handleRequestUpdate = async (tripId: string, newStatus: string) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to change the status to ${newStatus}?`
    );
  
    if (!isConfirmed) return;
  
    const { error } = await supabase
      .from("feedback_complaints")
      .update({ request: newStatus })
      .eq("trip_id", tripId);
  
    if (error) {
      console.error("Error updating status:", error.message);
    } else {
      // Re-fetch data to update the UI
      fetchData();
    }
  };
  

  // Filter data based on filters state
  const applyFilters = () => {
    let filtered = [...data]; // Start with all data
  
    if (filters.trip_id) {
      filtered = filtered.filter((item) =>
        item.trip_id.toString().toLowerCase().includes(filters.trip_id.toLowerCase()) // Convert to string for comparison
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
    Type_Of_Complaints:item.Type_of_complaints,
    Raised_by: item.raised_by,
    Raised_For: item.raised_for,
    Trip_id: item.trip_id.toString(), // Convert trip_id to string for safe usage
    Complaint_Box: item.complaint_box,
    Request: (
      <select
        value={item.request}
        onChange={(e) => handleRequestUpdate(item.trip_id, e.target.value)} // Handle status update via dropdown
        style={{
          cursor: "pointer",
          color: getStatusColor(item.request), // Apply color based on status
          fontWeight: "bold",
        }}
      >
        <option value="Pending">Pending</option>
        <option value="Resolved">Resolved</option>
      </select>
    ),
  }));
  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit to apply filters
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(); // Apply the filters when the form is submitted
  };

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
                  <label htmlFor="trip_id">Trip ID</label>
                  <input
                    className="form-control"
                    type="text"
                    name="trip_id"
                    id="trip_id"
                    value={filters.trip_id}
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
                  <button
                    type="button"
                    className="close_btn"
                    onClick={() => {
                      setFilters({ trip_id: "", request: "" });
                      setFilteredData(data); // Reset filters
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
                data={mappedData} // Use filtered and mapped data
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
