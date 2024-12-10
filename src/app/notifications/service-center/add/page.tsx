"use client";

import React, { useState } from "react";
import { FieldError, useForm, Controller } from "react-hook-form";
import Select from "react-select"; // Correct import
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from '../../../../../components/Header';
import Sidemenu from "../../../../../components/Sidemenu";

const formSchema = z.object({
    role_name: z
        .string()
        .min(1, "Service Center Name is required")
        .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters"),
    service_centers: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .min(1, "At least one service center must be selected"),
    name: z.string().min(1, "Title is required"),
    upload: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NotificatioServicecenteradd = () => {
    const [isToggled, setIsToggled] = useState(false); // State for toggle

    const {
        register,
        handleSubmit,
        control, // Controller from react-hook-form
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

    // Corrected MultiOptions with the correct key `label`
    const MultiOptions = [
        { value: "india", label: "india" },
        { value: "pakistan", label: "pakistan" },
        { value: "china", label: "china" },
        { value: "srilanka", label: "srilanka" },
        { value: "afganistan", label: "afganistan" },
    ];

    return (
        <main className="add_notification_service_center_main">
            <Header />
            <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
                <div className="inner_left">
                    <Sidemenu onToggle={toggleClass} />
                </div>
                <div className="inner_right">
                    <div className="add_service_formbox checkbox_formbox">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="service_form_heading">
                                Notification to Service Center
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="state">Select Service Center <span>*</span></label>
                                <Controller
                                    control={control} // Use Controller to integrate react-select with react-hook-form
                                    name="service_centers"
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={MultiOptions}
                                            isMulti
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                        />
                                    )}
                                />
                                {errors.service_centers && (
                                    <p className="erro_message">{errors.service_centers.message}</p>
                                )}
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="name">Title <span>*</span></label>
                                <input className="form-control" {...register("name")} type="text" id="name" />
                                {errors.name && (
                                    <p className="erro_message">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="message">Message</label>
                                <textarea className="form-control" name="message" id="message" rows={1}></textarea>
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="upload">Upload Document <span>*</span></label>
                                <input className="form-control" type="file" {...register("upload")} id="upload" />
                                {errors.upload && (
                                    <p className="erro_message">{(errors.upload as FieldError).message}</p>
                                )}
                            </div>
                            <div className="inner_form_group inner_form_group_submit">
                                <input type="submit" className="submite_btn" value="Submit" />
                                <input type="submit" className="close_btn" value="Close" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default NotificatioServicecenteradd;
