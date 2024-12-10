"use client";

import React, { useState } from "react";
import { FieldError, useForm, Controller } from "react-hook-form";
import Select from "react-select"; // Correct import
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from '../../../../components/Header';
import Sidemenu from "../../../../components/Sidemenu";


const SystemSetting = () => {
    const [isToggled, setIsToggled] = useState(false); // State for toggle

    const toggleClass = () => {
        setIsToggled(!isToggled); // Toggle the state
    };
    return (
        <main className="add_notification_service_center_main">
            <Header />
            <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
                <div className="inner_left">
                    <Sidemenu onToggle={toggleClass} />
                </div>
                <div className="inner_right">
                    <div className="add_service_formbox checkbox_formbox">
                        <form action="">
                            <div className="service_form_heading">
                                Assign Permissions
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="name">Name</label>
                                <input className="form-control" name="name" type="text" id="name" />
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="email">Email</label>
                                <input className="form-control" type="email" name="email" id="email" />
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="roll_name">Roll Name</label>
                                <select className="form-control" name="roll_name" id="roll_name">
                                    <option value="">Select Roll Name</option>
                                    <option value="">Roll 1</option>
                                    <option value="">Roll 2</option>
                                    <option value="">Roll 3</option>
                                    <option value="">Roll 4</option>
                                    <option value="">Roll 5</option>
                                </select>
                                <div className="down_arrow_btn">
                                    <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
                                </div>
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="password">Password</label>
                                <input className="form-control" name="password" type="text" id="password" />
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

export default SystemSetting
