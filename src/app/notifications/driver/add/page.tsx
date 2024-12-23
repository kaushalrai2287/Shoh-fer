"use client";

import React, { useEffect, useState } from "react";
import { FieldError, useForm, Controller } from "react-hook-form";
import Select from "react-select"; // Correct import
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "../../../../../components/Header";
import Sidemenu from "../../../../../components/Sidemenu";
import { createClient } from "../../../../../utils/supabase/client";
import HeadingBredcrum from "../../../../../components/HeadingBredcrum";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  message: z
    .string()
    .min(1, "Service Center Name is required")
    .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters"),
  Driver: z
    .array(
      z.object({ value: z.union([z.string(), z.number()]), label: z.string() })
    )
    .min(1, "At least one service center must be selected"),
  name: z.string().min(1, "Title is required"),
  upload: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NotificatioDriveradd = () => {
  const [isToggled, setIsToggled] = useState(false); // State for toggle

  const [driver, setDriver] = useState<any[]>([]); // State to store all fetched service centers
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); //
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const toggleClass = () => {
    setIsToggled(!isToggled); // Toggle the state
  };
  
 const handleClose = (event: { preventDefault: () => void }) => {
        
    event.preventDefault(); // Prevent default form behavior
    router.push("/notifications/driver/list"); // Navigate to the desired page
  };


  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append('message', data.message);
      formData.append('name', data.name);
      formData.append('Driver', JSON.stringify(data.Driver));
  
      if (data.upload && data.upload.length > 0) {
        formData.append('upload', data.upload[0]); // Ensure the first file is sent
      }
  
      const response = await fetch("/api/Notification/ToDriver", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message); // Success message
      } else {
        alert(result.error); // Error message
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      alert("Something went wrong.");
    }
  };
  

//   const onSubmit = async (data: FormValues) => {
//     try {
//       const response = await fetch("/api/Notification/ToDriver", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: data.message,
//           name: data.name,
//           Driver: data.Driver,
//           upload: data.upload,
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert(result.message); // Success message
//       } else {
//         alert(result.error); // Error message
//       }
//     } catch (err) {
//       console.error("Unexpected Error:", err);
//       alert("Something went wrong.");
//     }
//   };

  // const onSubmit = (data: FormValues) => {
  //     console.log("Form Data:", data);
  // };
  useEffect(() => {
    const fetchDriver = async () => {
      setLoading(true);
      try {
        const supabase = createClient();

        const { data, error } = await supabase.from("drivers").select("*");

        if (error) {
          setError(error.message);
        } else {
          const formattedDriver = data.map((center: any) => ({
            value: center.driver_id,
            label: center.driver_name,
          }));

          setDriver(formattedDriver);
        }
      } catch (err) {
        console.error("Error fetching service centers:", err);
        setError("Something went wrong while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, []);

  return (
    <main className="add_notification_service_center_main">
      <Header />
      <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
        <div className="inner_left">
          <Sidemenu onToggle={toggleClass} />
        </div>
        <div className="inner_right">
          <HeadingBredcrum
            heading="Driver Notification Add"
            breadcrumbs={[
              { label: "Home", link: "/", active: false },
              { label: "Driver Notification Add", active: true },
            ]}
          />
          <div className="add_service_formbox checkbox_formbox">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="service_form_heading">
                Notification to Drivers
              </div>
              <div className="inner_form_group">
                <label htmlFor="state">
                  Select Driver <span>*</span>
                </label>

                <Controller
                  control={control}
                  name="Driver" // Only name, no register
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={driver}
                      isMulti
                      isLoading={loading}
                      placeholder="Select Driver"
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  )}
                />

                {errors.Driver && (
                  <p className="erro_message">{errors.Driver.message}</p>
                )}
              </div>
              <div className="inner_form_group">
                <label htmlFor="name">
                  Title <span>*</span>
                </label>
                <input
                  className="form-control"
                  {...register("name")}
                  type="text"
                  id="name"
                />
                {errors.name && (
                  <p className="erro_message">{errors.name.message}</p>
                )}
              </div>
              <div className="inner_form_group">
                <label htmlFor="message">Message</label>
                <textarea
                  className="form-control"
                  {...register("message")}
                  id="message"
                  rows={1}
                ></textarea>
              </div>
              <div className="inner_form_group">
                <label htmlFor="upload">
                  Upload Document <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="file"
                  {...register("upload")}
                  id="upload"
                />
                {errors.upload && (
                  <p className="erro_message">
                    {(errors.upload as FieldError).message}
                  </p>
                )}
              </div>
              <div className="inner_form_group inner_form_group_submit">
                <input type="submit" className="submite_btn" value="Submit" />
                <input type="button" className="close_btn" value="Close" onClick={handleClose} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotificatioDriveradd;
