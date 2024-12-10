"use client";

import React, { useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Header from '../../../../components/Header';
import Sidemenu from "../../../../components/Sidemenu";

const formSchema = z.object({
    role_name: z
        .string()
        .min(1, "Service Center Name is required")
        .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters"),
});

type FormValues = z.infer<typeof formSchema>;

const RollsPermissionAdd = () => {

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
        <main className="add_rolls_permission_main">
            <Header />
            <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
                <div className="inner_left">
                    <Sidemenu onToggle={toggleClass} />
                </div>
                <div className="inner_right">
                    <div className="add_service_formbox checkbox_formbox">
                        <form action="" onSubmit={handleSubmit(onSubmit)}>
                            <div className="service_form_heading">
                                Add Role
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="name">Role Name <span>*</span></label>
                                <input className="form-control" {...register("role_name")} type="text" id="name" />
                                {errors.role_name && (
                                    <p className="erro_message">{errors.role_name.message}</p>
                                )}
                            </div>
                            <div className="service_form_heading service_form_heading_second">
                                Enable Sections <span>*</span>
                            </div>
                            <div className="inner_form_group inner_form_group_checkbox mb-2">
                                <label htmlFor="">Category Management</label>
                                <input type="checkbox" name="" id="" />
                            </div>
                            <div className="inner_form_group inner_form_group_checkbox mb-2">
                                <label htmlFor="">Notification</label>
                                <input type="checkbox" name="" id="" />
                            </div>
                            <div className="inner_form_group inner_form_group_checkbox mb-2">
                                <label htmlFor="">User Management</label>
                                <input type="checkbox" name="" id="" />
                            </div>
                            <div className="inner_form_group inner_form_group_checkbox mb-2">
                                <label htmlFor="">Product Management</label>
                                <input type="checkbox" name="" id="" />
                            </div>
                            <div className="inner_form_group inner_form_group_checkbox mb-2">
                                <label htmlFor="">Vendor Management</label>
                                <input type="checkbox" name="" id="" />
                            </div>
                            <div className="inner_form_group inner_form_group_checkbox mb-2">
                                <label htmlFor="">Order Management</label>
                                <input type="checkbox" name="" id="" />
                            </div>
                            <div className="inner_form_group inner_form_group_checkbox mb-2">
                                <label htmlFor="">Discount Management</label>
                                <input type="checkbox" name="" id="" />
                            </div>
                            <div className="inner_form_group inner_form_group_checkbox">
                                <label htmlFor="">Web and App Settings</label>
                                <input type="checkbox" name="" id="" />
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


export default RollsPermissionAdd