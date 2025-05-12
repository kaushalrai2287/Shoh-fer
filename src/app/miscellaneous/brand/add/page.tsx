"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "../../../../../components/Header";
import Sidemenu from "../../../../../components/Sidemenu";
import { createClient } from "../../../../../utils/supabase/client";

const supabase = createClient();

const formSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
});

type FormValues = z.infer<typeof formSchema>;

const BrandAdd = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const toggleClass = () => {
    setIsToggled(!isToggled);
  };

  const onSubmit = async (data: FormValues) => {
    const { error } = await supabase
      .from("brands")
      .insert([{ name: data.brand }]);
  
    if (error) {
      console.error("Insert error:", error);
      setSubmitMessage("Failed to add brand.");
    } else {
      alert("Brand added successfully!");
      setSubmitMessage("Brand added successfully!");
      reset();
    }
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="service_form_heading">Basic Information</div>

              <div className="inner_form_group">
                <label htmlFor="brand">
                  Brand <span>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="brand"
                  placeholder="Enter brand name"
                  {...register("brand")}
                />
                {errors.brand && (
                  <p className="erro_message">{errors.brand.message}</p>
                )}
              </div>

              {submitMessage && (
                <div className="form_success_message">{submitMessage}</div>
              )}

              <div className="inner_form_group inner_form_group_submit">
                <input type="submit" className="submite_btn" value="Submit" />
                <input
                  type="button"
                  className="close_btn"
                  value="Close"
                  onClick={() => reset()}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BrandAdd;
