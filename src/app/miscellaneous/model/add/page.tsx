"use client";

import React, { useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Header from "../../../../../components/Header";
import Sidemenu from "../../../../../components/Sidemenu";



const formSchema = z.object({
    model: z.string().min(1, "Vehicle Type is required"),
    t_model: z.string().min(1, "Transmission Type is required"),
});

type FormValues = z.infer<typeof formSchema>;

const BrandAdd = () => {

    const [isToggled, setIsToggled] = useState(false); // State for toggle

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const toggleClass = () => {
        setIsToggled(!isToggled); // Toggle the state
    };

    const onSubmit = (data: FormValues) => {
        console.log("Form Data:", data);
    };
    return (
        <main className="add_brand_name">
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
                                <label htmlFor="model">Model <span>*</span></label>
                                <select className="form-control" id="model" {...register("model")}>
                                    <option value="">Select Model</option>
                                    <option value="Model one">Model one</option>
                                    <option value="Model two">Model two</option>
                                    <option value="Model three">Model three</option>
                                    <option value="Model four">Model four</option>
                                </select>
                                {errors.model && (
                                    <p className="erro_message">{errors.model.message}</p>
                                )}
                                <div className="down_arrow_btn">
                                    <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
                                </div>
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="t_model">Transmission Type <span>*</span></label>
                                <select className="form-control" id="t_model" {...register("t_model")}>
                                    <option value="">Select Transmission</option>
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                    <option value="Clutchless Manual">Clutchless Manual</option>
                                </select>
                                {errors.t_model && (
                                    <p className="erro_message">{errors.t_model.message}</p>
                                )}
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


export default BrandAdd