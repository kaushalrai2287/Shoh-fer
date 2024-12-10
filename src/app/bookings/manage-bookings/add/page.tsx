"use client";

import React, { useEffect, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Header from '../../../../../components/Header';
import Sidemenu from "../../../../../components/Sidemenu";
import { createClient } from "../../../../../utils/supabase/client";
import HeadingBredcrum from "../../../../../components/HeadingBredcrum";

const formSchema = z.object({
    b_type: z.string().min(1, "Brand is required"),
    model:z.string().min(1, "model is required"),
    s_list:z.string().min(1, "model is required"),
    cnumber: z
        .string()
        .regex(/^\d+$/, "Contact Number must contain only digits")
        .min(10, "Contact Number must be at least 10 digits")
        .max(10, "Contact Number must be at most 10 digits"),
    name: z
        .string()
        .min(1, "Vehicle Number is required")
        .regex(/^[a-zA-Z\s0-9]+$/, "Vehicle Number must contain only letters and numbers"), // Adjust as needed
    cperson: z
        .string()
        .min(1, "Customer Name is required")
        .regex(/^[a-zA-Z\s]+$/, "Customer Name must only contain letters"),
    p_location: z.string().min(1, "Pick Up Location is required"),
    d_location: z.string().min(1, "Drop Location is required"),
    // p_date: z.string().min(1, "Pick Up Date and Time is required"),
    p_experience:z.string().min(1, "exp required"),
    driver_select:z.string(),
    vehicle_condition:z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const AddBookings = () => {

    const [isToggled, setIsToggled] = useState(false); // State for toggle
    const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
    const [models, setModels] = useState<{ id: string; brand_id: string; name: string }[]>([]);
    const [serviceCenters, setServiceCenters] = useState<{ service_center_id: string; name: string }[]>([]);
    const [drivers, setDrivers] = useState<{ driver_id: string; driver_name: string }[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });
    console.log(errors);

    const toggleClass = () => {
        setIsToggled(!isToggled); // Toggle the state
    };

     // Fetch Brands on Page Load
     useEffect(() => {
        const fetchBrands = async () => {
            const supabase = createClient();
            const { data, error } = await supabase.from("brands").select("id, name");
            if (error) console.error("Error fetching brands:", error);
            else setBrands(data || []);
        };
        fetchBrands();
    }, []);

    // Fetch Models based on Selected Brand
    useEffect(() => {
        const fetchModels = async () => {
            if (!selectedBrand) return;
            const supabase = createClient();
            const { data, error } = await supabase
                .from("models")
                .select("id, brand_id, name") // Include brand_id here
                .eq("brand_id", selectedBrand);
            if (error) console.error("Error fetching models:", error);
            else setModels(data || []);
        };
        
        fetchModels();
    }, [selectedBrand]);

    useEffect(() => {
        const fetchServiceCenters = async () => {
            const supabase = createClient();
            const { data, error } = await supabase.from("service_centers").select("service_center_id, name"); // Assuming the table name is "service_centers"
            if (error) console.error("Error fetching service centers:", error.message);
            else setServiceCenters(data || []);
        };
        fetchServiceCenters();
    }, []);
    useEffect(() => {
        const fetchDrivers = async () => {
            const supabase = createClient();
            const { data, error } = await supabase.from("drivers").select("driver_id, driver_name"); // Assuming the table is 'drivers'
            if (error) console.error("Error fetching drivers:", error);
            else setDrivers(data || []);
        };
        fetchDrivers();
    }, []);

    const onSubmit = async (data: FormValues) => {
        console.log("Form data submitted:", data); // Debug log
        try {
            const supabase = createClient();
    
            const { data: vehicleData, error: vehicleError } = await supabase
                .from("vehicles")
                .insert([{ 
                    brand_id: data.b_type,  
                    model_id: data.model,   
                    license_plate_no: data.name ,
                    condition:data.vehicle_condition,
                    service_center_id: data.s_list,
                }])
                .select("vehicle_id")
                .single();
    
            if (vehicleError) {
                console.error("Vehicle Insert Error:", vehicleError.message);
                return;
            }
            console.log("Vehicle data inserted:", vehicleData);
    
            // Proceed to bookings table
            const vehicle_id = vehicleData.vehicle_id;
    
            const { error: bookingError } = await supabase.from("bookings").insert([
                {
                    vehicle_id,
                    customer_name: data.cperson,
                    customer_phone: data.cnumber,
                    pickup_address: data.p_location,
                    dropoff_address: data.d_location,
                    driver_id:data.driver_select,
                    // pickup_date: data.p_date,
                    service_center_id: data.s_list,
                },
            ]);
    
            if (bookingError) {
                console.error("Booking Insert Error:", bookingError.message);
                return;
            }
    
            alert("Booking successfully added!");
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };
    
    

    return (
        <main className="add_service_center_main">
            <Header />
            <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
                <div className="inner_left">
                    <Sidemenu onToggle={toggleClass} />
                </div>
                <div className="inner_right">
                <HeadingBredcrum
                        heading="Add Booking"
                        breadcrumbs={[
                            { label: 'Home', link: '/', active: false },
                            { label: 'Add Booking', active: true },
                        ]}
                    />
                    <div className="add_service_formbox">
                    <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="service_form_heading">
                                Basic Information
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="b_type">Brand <span>*</span></label>
                            

                                <select
                                className="form-control"
                                {...register("b_type")}
                                id="b_type"
                                onChange={(e) => {
                                    setSelectedBrand(e.target.value);
                                    setValue("model", ""); // Reset model selection
                                }}
                            >
                                <option value="">Select Brand</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                                {errors.b_type && (
                                    <p className="erro_message">{errors.b_type.message}</p>
                                )}
                                <div className="down_arrow_btn">
                                    <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
                                </div>
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="model">Model</label>
                             

                                <select className="form-control" {...register("model")} id="model">
                                <option value="">Select Model</option>
                                {models.map((model) => (
                                    <option key={model.id} value={model.id}>
                                        {model.name}
                                    </option>
                                ))}
                            </select>
                                <div className="down_arrow_btn">
                                    <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
                                </div>
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="s_list">Service Center</label>
                                <select className="form-control" {...register("s_list")} id="s_list">
                                    <option value="">Select Service Center</option>
                                    {serviceCenters.map((center) => (
                                        <option key={center.service_center_id} value={center.service_center_id}>
                                            {center.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="down_arrow_btn">
                                    <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
                                </div>
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="cperson">Customer Name <span>*</span></label>
                                <input className="form-control" type="text" {...register("cperson")} id="cperson" />
                                {errors.cperson && (
                                    <p className="erro_message">{errors.cperson.message}</p>
                                )}
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="cnumber">Customer Phone Number <span>*</span></label>
                                <input className="form-control" type="text" {...register("cnumber")} id="cnumber" />
                                {errors.cnumber && (
                                    <p className="erro_message">{errors.cnumber.message}</p>
                                )}
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="name">Vehicle Number <span>*</span></label>
                                <input className="form-control" {...register("name")} type="text" id="name" />
                                {errors.name && (
                                    <p className="erro_message">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="vehicle_condition">Vehicle Condition</label>
                                <textarea className="form-control" {...register("vehicle_condition")} name="vehicle_condition" id="vehicle_condition" rows={1}></textarea>
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="p_location">Pick Up Location <span>*</span></label>
                                <input className="form-control" type="text" {...register("p_location")} id="p_location" />
                                {errors.p_location && (
                                    <p className="erro_message">{errors.p_location.message}</p>
                                )}
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="d_location">Drop Location <span>*</span></label>
                                <input className="form-control" type="text" {...register("d_location")} id="d_location" />
                                {errors.d_location && (
                                    <p className="erro_message">{errors.d_location.message}</p>
                                )}
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="driver_select">Driver Select</label>
                                <select className="form-control"  {...register("driver_select")} id="driver_select" name="driver_select">
                                    <option value="">Select Driver</option>
                                    {drivers.map((driver) => (
                                        <option key={driver.driver_id} value={driver.driver_id}>
                                            {driver.driver_name}
                                        </option>
                                    ))}
                                </select>
                                <div className="down_arrow_btn">
                                    <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
                                </div>
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="p_experience">Previous Experience</label>
                                <input className="form-control"  {...register("p_experience")}  type="text" name="p_experience" id="p_experience" />
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="driver_rating">Driver Rating</label>
                                <select className="form-control" id="driver_rating" name="driver_rating">
                                    <option value="">Select Rating</option>
                                    <option value="rone">1 Star</option>
                                    <option value="rtwo">2 Star</option>
                                    <option value="rthree">3 Star</option>
                                    <option value="rfour">4 Star</option>
                                    <option value="rfive">5 Star</option>
                                </select>
                                <div className="down_arrow_btn">
                                    <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
                                </div>
                            </div>
                            <div className="inner_form_group inner_form_group_submit">
                                <input type="submit" className='submite_btn' value="Submit" />
                                {/* <input type="submit" className='close_btn' value="Close" /> */}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}


export default AddBookings