// "use client";

// import React, { useEffect, useState } from "react";
// import { FieldError, useForm, Controller } from "react-hook-form";
// import Select from "react-select"; // Correct import
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import Header from '../../../../../components/Header';
// import Sidemenu from "../../../../../components/Sidemenu";
// import { createClient } from "../../../../../utils/supabase/client";

// const formSchema = z.object({
//     role_name: z
//         .string()
//         .min(1, "Service Center Name is required")
//         .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters"),
//     service_centers: z
//         .array(z.object({ value: z.string(), label: z.string() }))
//         .min(1, "At least one service center must be selected"),
//     name: z.string().min(1, "Title is required"),
//     upload: z.any().optional(),
// });

// type FormValues = z.infer<typeof formSchema>;

// const NotificatioServicecenteradd = () => {
//     const [isToggled, setIsToggled] = useState(false); // State for toggle
//     const [serviceCenters, setServiceCenters] = useState<any[]>([]); // State to store all fetched service centers
//     const [loading, setLoading] = useState<boolean>(true); // Loading state
//     const [error, setError] = useState<string | null>(null); // Error state

//     const {
//         register,
//         handleSubmit,
//         control, // Controller from react-hook-form
//         formState: { errors },
//     } = useForm<FormValues>({
//         resolver: zodResolver(formSchema),
//     });

//     const toggleClass = () => {
//         setIsToggled(!isToggled); // Toggle the state
//     };

//     const onSubmit = (data: FormValues) => {
//         console.log("Form Data:", data);
//     };

//     useEffect(() => {
//         const fetchServiceCenters = async () => {
//             setLoading(true);
//             try {
//                 const supabase = createClient();

//                 // Fetch all service centers from Supabase
//                 const { data, error } = await supabase
//                     .from("service_centers")
//                     .select("*");

//                 if (error) {
//                     setError(error.message);
//                 } else {
//                     // Map service centers to the format expected by react-select
//                     const formattedServiceCenters = data.map((center: any) => ({
//                         value: center.service_center_id,
//                         label: center.name, // Assuming 'name' is the column containing service center name
//                     }));

//                     setServiceCenters(formattedServiceCenters);
//                 }
//             } catch (err) {
//                 console.error("Error fetching service centers:", err);
//                 setError("Something went wrong while fetching the data.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchServiceCenters();
//     }, []); 




//     return (
//         <main className="add_notification_service_center_main">
//             <Header />
//             <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
//                 <div className="inner_left">
//                     <Sidemenu onToggle={toggleClass} />
//                 </div>
//                 <div className="inner_right">
//                     <div className="add_service_formbox checkbox_formbox">
//                         <form onSubmit={handleSubmit(onSubmit)}>
//                             <div className="service_form_heading">
//                                 Notification to Service Center
//                             </div>
//                             <div className="inner_form_group">
//                                 <label htmlFor="state">Select Service Center <span>*</span></label>
//                                 <Controller
//                                     control={control} // Use Controller to integrate react-select with react-hook-form
//                                     name="service_centers"
//                                     render={({ field }) => (
//                                         <Select
//                                             {...field}
//                                             options={serviceCenters} // Use fetched service centers
//                                             isMulti
//                                             className="react-select-container"
//                                             classNamePrefix="react-select"
//                                         />
//                                     )}
//                                 />
//                                 {errors.service_centers && (
//                                     <p className="erro_message">{errors.service_centers.message}</p>
//                                 )}
//                             </div>
//                             <div className="inner_form_group">
//                                 <label htmlFor="name">Title <span>*</span></label>
//                                 <input className="form-control" {...register("name")} type="text" id="name" />
//                                 {errors.name && (
//                                     <p className="erro_message">{errors.name.message}</p>
//                                 )}
//                             </div>
//                             <div className="inner_form_group">
//                                 <label htmlFor="message">Message</label>
//                                 <textarea className="form-control" name="message" id="message" rows={1}></textarea>
//                             </div>
//                             <div className="inner_form_group">
//                                 <label htmlFor="upload">Upload Document <span>*</span></label>
//                                 <input className="form-control" type="file" {...register("upload")} id="upload" />
//                                 {errors.upload && (
//                                     <p className="erro_message">{(errors.upload as FieldError).message}</p>
//                                 )}
//                             </div>
//                             <div className="inner_form_group inner_form_group_submit">
//                                 <input type="submit" className="submite_btn" value="Submit" />
//                                 <input type="submit" className="close_btn" value="Close" />
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// };

// export default NotificatioServicecenteradd;
"use client";

import React, { useEffect, useState } from "react";
import { FieldError, useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from '../../../../../components/Header';
import Sidemenu from "../../../../../components/Sidemenu";
import { createClient } from "../../../../../utils/supabase/client";
import HeadingBredcrum from "../../../../../components/HeadingBredcrum";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    message: z
        .string()
        .min(1, "Service Center Name is required")
        .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters"),
        service_centers: z
    .array(z.object({ value: z.union([z.string(), z.number()]), label: z.string() }))
    .min(1, "At least one service center must be selected"),

    name: z.string().min(1, "Title is required"),
    upload: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NotificatioServicecenteradd = () => {
    const [isToggled, setIsToggled] = useState(false); // State for toggle
    const [serviceCenters, setServiceCenters] = useState<any[]>([]); // State to store all fetched service centers
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const router = useRouter();




    const { register, handleSubmit, control, formState: { errors, isValid } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            service_centers: [],
            message: "",
            name: "",
            upload: null
        }
    });
    

    const toggleClass = () => {
        setIsToggled(!isToggled); 
    };
    const onSubmit = async (data: FormValues) => {
        try {
            const formData = new FormData();
            formData.append('message', data.message);
            formData.append('name', data.name);
            formData.append('service_centers', JSON.stringify(data.service_centers));
    
            if (data.upload && data.upload.length > 0) {
                formData.append('upload', data.upload[0]); // Add uploaded file
            }
    
            const response = await fetch("/api/Notification/ToServiceCenter", {
                method: "POST",
                body: formData,
            });
    
            const result = await response.json();
    
            if (response.ok) {
                alert(result.message);  // Success message
            } else {
                alert(result.error);    // Error message
            }
        } catch (err) {
            console.error("Unexpected Error:", err);
            alert("Something went wrong.");
        }
    };
    

    // const onSubmit = async (data: FormValues) => {
    //     try {
    //         const response = await fetch("/api/Notification/ToServiceCenter", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 message: data.message,
    //                 name: data.name,
    //                 service_centers: data.service_centers,
    //                 upload: data.upload, 
    //             }),
    //         });
    
    //         const result = await response.json();
    
    //         if (response.ok) {
    //             alert(result.message);  // Success message
    //         } else {
    //             alert(result.error);    // Error message
    //         }
    //     } catch (err) {
    //         console.error("Unexpected Error:", err);
    //         alert("Something went wrong.");
    //     }
    // };
    

    
    // Add global Zod error logging
    const onError = (errors: any) => {
        console.log("Zod Validation Errors:", errors);
        // You can further process the error object for detailed logs
    };
    const handleClose = (event: { preventDefault: () => void }) => {
        
        event.preventDefault(); // Prevent default form behavior
        router.push("/notifications/driver/list"); // Navigate to the desired page
      };

    useEffect(() => {
        const fetchServiceCenters = async () => {
            setLoading(true);
            try {
                const supabase = createClient();

            
                const { data, error } = await supabase
                    .from("service_centers")
                    .select("*");

                if (error) {
                    setError(error.message);
                } else {
                   
                    const formattedServiceCenters = data.map((center: any) => ({
                        value: center.service_center_id,
                        label: center.name, // Assuming 'name' is the column containing service center name
                    }));

                    setServiceCenters(formattedServiceCenters);
                }
            } catch (err) {
                console.error("Error fetching service centers:", err);
                setError("Something went wrong while fetching the data.");
            } finally {
                setLoading(false);
            }
        };

        fetchServiceCenters();
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
            heading="Service Center Notification Add"
            breadcrumbs={[
              { label: "Home", link: "/", active: false },
              { label: "Service Center Notification Add", active: true },
            ]}
            />
                    <div className="add_service_formbox checkbox_formbox">
                        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
                        <form onSubmit={handleSubmit(onSubmit, onError)}>
                            <div className="service_form_heading">
                                Notification to Service Center
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="state">Select Service Center <span>*</span></label>
                                <Controller
                                    control={control}
                                    name="service_centers" // Only name, no register
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={serviceCenters}
                                            isMulti
                                            isLoading={loading}
                                            placeholder="Select Service Centers"
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
                                <textarea className="form-control" {...register("message")}  id="message" rows={1}></textarea>
                                {errors.message && (
                                    <p className="erro_message">{errors.message.message}</p>
                                )}
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
                                <input type="button" className="close_btn" value="Close" onClick={handleClose} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default NotificatioServicecenteradd;
