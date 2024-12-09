"use client";

import React, { useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Header from "../../../../../../components/Header";
import Sidemenu from "../../../../../../components/Sidemenu";



const formSchema = z.object({
    b_type: z.string().min(1, "Brand is required"),
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
    p_date: z.string().min(1, "Pick Up Date and Time is required"),
});

type FormValues = z.infer<typeof formSchema>;

const EditBookings = () => {

    const [isToggled, setIsToggled] = useState(false); // State for toggle

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const toggleClass = () => {
        setIsToggled(!isToggled); 
    };

    const onSubmit = (data: FormValues) => {
        console.log("Form Data:", data);
    };
    return (
        <main className="add_service_center_main">
            <Header />
            <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
                <div className="inner_left">
                    <Sidemenu onToggle={toggleClass} />
                </div>
                <div className="inner_right">
                    <div className="add_service_formbox">
                        <form action="" onSubmit={handleSubmit(onSubmit)}>
                            <div className="service_form_heading">
                                Basic Information
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="b_type">Brand <span>*</span></label>
                                <select className="form-control" id="b_type" {...register("b_type")}>
                                    <option value="">Select Brand</option>
                                    <option value="Dummy one">Dummy one</option>
                                    <option value="Dummy two">Dummy two</option>
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
                                <select className="form-control" id="model" name="model">
                                    <option value="">Select Vehicle</option>
                                    <option value="model one">Model one</option>
                                    <option value="model two">Model two</option>
                                </select>
                                <div className="down_arrow_btn">
                                    <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
                                </div>
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="s_list">Service Center</label>
                                <select className="form-control" id="s_list" name="s_list">
                                    <option value="">Select Service Center</option>
                                    <option value="Service center one">Service center one</option>
                                    <option value="Service center two">Service center two</option>
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
                                <textarea className="form-control" name="vehicle_condition" id="vehicle_condition" rows={1}></textarea>
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
                                <select className="form-control" id="driver_select" name="driver_select">
                                    <option value="">Select Driver</option>
                                    <option value="Driver one">Driver one</option>
                                    <option value="Driver two">Driver two</option>
                                </select>
                                <div className="down_arrow_btn">
                                    <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
                                </div>
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="p_experience">Previous Experience</label>
                                <input className="form-control" type="text" name="p_experience" id="p_experience" />
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
                                <input type="submit" className='close_btn' value="Close" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}


export default EditBookings