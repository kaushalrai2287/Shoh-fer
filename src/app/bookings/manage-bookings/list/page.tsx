"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from '../../../../../components/Header';
import Sidemenu from "../../../../../components/Sidemenu";
import { DataTable } from "../../../../../components/ui/datatable";
import Link from "next/link";
import { createClient } from "../../../../../utils/supabase/client";
import router, { useRouter } from "next/navigation";

// Supabase client initialization
const supabase = createClient();

// Define types for booking data
// interface Vehicle {
//     brand_id: string;
//     model_id: string;
//     license_plate_no: string;
//     condition: string;
// }

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
    status: string;
   
 
    // vehicle: Vehicle;
}

const ListBooking = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isToggled, setIsToggled] = useState(false); 
    const [bookings, setBookings] = useState<Booking[]>([]); 
    const [loading, setLoading] = useState(true);
    const [driverNameQuery, setDriverNameQuery] = useState(""); // Driver name search
    const toggleClass = () => {
        setIsToggled(!isToggled);
    };


    

    const columns = {
        Service_Center_Name: "Service Center Name",
        Driver_Name: "Driver Name",
        Tracking_link: "Tracking Link",
        Brand: "Brand",
        Model: "Model",
        Customer_Name: "Customer Name",
        Customer_Phone_Number: "Customer Phone Number",
        Vehicle_Number: "Vehicle Number",
        Vehicle_Condition: "Vehicle Condition",
        Pick_Up_Location: "Pick Up Location",
        Drop_Location: "Drop Location",
        Previous_Experince: "Previous Experience",
        Driver_Rating: "Driver Rating",
        Status: "Status",
        // Booking: "Booking",
    };

    const hiddenColumns = [
        'Tracking_link',
        'Brand',
        'Model',
        'Customer_Name',
        'Customer_Phone_Number',
        'Vehicle_Number',
        'Vehicle_Condition',
        'Pick_Up_Location',
        'Drop_Location',
        'Previous_Experince',
        'Driver_Rating',
    ];


  

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
    
            // Assuming `bookings` has foreign keys for `vehicle_id` and `service_center_id`
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *
                    ,service_centers(*),drivers(*),vehicles(*,brands(*),models(*))
                    
                `)
               
    console.log(data);
            if (error) {
                console.error("Error fetching bookings:", error.message);
            } else {
                const bookingsWithVehicle = data.map((booking: any) => ({
                    ...booking,
                   
                }));
    
                setBookings(bookingsWithVehicle);
            }
    
            setLoading(false);
        };
    
        fetchBookings();
    }, []);
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'service' | 'driver') => {
        if (type === 'service') {
            setSearchQuery(event.target.value);
        } else {
            setDriverNameQuery(event.target.value);
        }
    };

    // Filter bookings based on service center name and driver name
    const handleSearchSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        // If search query is empty, reset the filtered data to show all bookings
     
            const filtered = bookings.filter((booking) => {
                const matchesServicecenterName = booking.service_centers?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
                const matchesDrivername = booking.drivers?.driver_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
                return matchesServicecenterName || matchesDrivername;
            });
            setBookings(filtered); 
        
    }

    type StatusType = 'pending' | 'accepted' | 'completed' | 'canceled';

    const handleDelete = async (bookingId: string) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('booking_id', bookingId);
    
            if (error) {
                console.error("Error deleting booking:", error.message);
            } else {
                // Remove the deleted booking from local state
                setBookings((prevBookings) =>
                    prevBookings.filter((booking) => booking.booking_id !== bookingId)
                );
            }
        }
    };
    const router =useRouter();

    const handleEdit = (bookingId: string) => {
       
        router.push(`/bookings/manage-bookings/edit/${bookingId}`);
    };

    const handleStatusUpdate = async (bookingId: string, currentStatus: string) => {
        // Map current status to the next status
        const statusCycle: Record<StatusType, StatusType> = {
            pending: "accepted",
            accepted: "completed",
            completed: "canceled",
            canceled: "pending",
        };
    
        // Ensure the status value is a valid StatusType
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
                    booking.booking_id === bookingId ? { ...booking, status: newStatus } : booking
                )
            );
        }
    };
    
    const getStatusColor = (status: string) => {
        const normalizedStatus = status.toLowerCase(); // Normalize status to lowercase
        switch (normalizedStatus) {
          case "pending":
            return "orange";
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
      

    if (loading) {
        return <div>Loading...</div>; 
    }

   
    const mappedData = bookings.map(booking => ({
      
        Service_Center_Name: booking.service_centers?.name || 'Unknown', 
        Driver_Name: booking.drivers?.driver_name,
        Tracking_link: 'https://www.google.com', 
  
        Brand: booking.vehicles.brands?.name || 'Unknown',
        Model: booking.vehicles.models?.name || 'Unknown',
        Customer_Name: booking.customer_name,
        Customer_Phone_Number: booking.customer_phone,
        Vehicle_Number: booking.vehicles?.license_plate_no || 'Unknown', 
        Vehicle_Condition: booking.vehicles?.condition || 'Unknown',
        Pick_Up_Location: booking.pickup_address,
        Drop_Location: booking.dropoff_address,
        Previous_Experince: '3 years',
        Driver_Rating: booking.driver_rating || 'N/A', 
       
        Status: (
            <span
              onClick={() => handleStatusUpdate(booking.booking_id, booking.status)} // Pass current status
              style={{
                cursor: "pointer",
                color: getStatusColor(booking.status),
                fontWeight: "bold",
              }}
            >
              {booking.status}
            </span>
          ),
        Booking: 'Cancel Booking',
        onEdit: () => handleEdit(booking.booking_id),
        // deleteLink: '#',
        onDelete: () => handleDelete(booking.booking_id),
    }));

    // console.log(mappedData);  

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
                            <div className="filter_btn">
                                <Link href="/bookings/manage-bookings/add">
                                    <button className="submite_btn">Add</button>
                                </Link>
                            </div>
                        </div>
                        <div className="filter_formbox">
                        <form onSubmit={handleSearchSubmit}>
                                <div className="inner_form_group">
                                    <label htmlFor="search_service_name">Service Center Name</label>
                                    <input className="form-control" type="text" name="search_service_name" id="search_service_name"     value={searchQuery}
                                        onChange={(e) => handleSearchChange(e, 'service')} />
                                </div>
                                <div className="inner_form_group">
                                    <label htmlFor="driver_name">Driver Name</label>
                                    <input className="form-control" type="text" name="driver_name" id="driver_name"    value={driverNameQuery}
                                        onChange={(e) => handleSearchChange(e, 'driver')}/>
                                </div>
                                <div className="inner_form_group">
                                    <label htmlFor="date">Date</label>
                                    <input className="form-control" type="date" name="date" id="date" />
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
                                    <img src="/images/bars-sort.svg" alt="" className="img-fluid" />
                                </span>
                                Booking List
                            </div>
                        </div>
                        <div className="filter_data_table">
                            <DataTable columns={columns} data={mappedData} hiddenColumns={hiddenColumns} showStatusButton={true} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ListBooking;

