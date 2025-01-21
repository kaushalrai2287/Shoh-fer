"use client";

import React, { useEffect, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect, useRouter } from "next/navigation";
import Sidemenu from "../../../../components/Sidemenu";
import Header from "../../../../components/Header";
import { createClient } from "../../../../utils/supabase/client";
import HeadingBredcrum from "../../../../components/HeadingBredcrum";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Service Center Name is required")
    .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters"),
  business_registration_no: z.string().optional(),
  service_area: z.string().min(1, "Service Area is required"),
  primary_contact_person: z
    .string()
    .min(1, "Primary Contact Person is required")
    .regex(/^[a-zA-Z\s]+$/, "Contact person name must only contain letters"),
  contact_number: z
    .string()
    .regex(/^\d+$/, "Contact Number must contain only digits")
    .min(10, "Contact Number must be at least 10 digits")
    .max(10, "Contact Number must be at most 10 digits"),
  email: z
    .string()
    .nonempty("Email is required") 
    .email("Please enter a valid email address"),
  alternate_contact: z
    .string()
    .optional()
    .refine((value) => !value || /^\d{1,10}$/.test(value), {
      message:
        "Alternate Contact Number must contain only digits and be at most 10 digits long",
    }),

  altebusiness_registration_no: z
    .string()
    .regex(/^\d*$/, "Alternate Contact Number must contain only digits")
    .optional(),
  address: z.string().min(1, "Address is required"),
  city: z
    .string()
    .min(1, "City is required")
    .regex(/^[a-zA-Z\s]+$/, "City must only contain letters"),
  state: z
    .union([z.string(), z.number()]) 
    .refine((value) => /^\d+$/.test(String(value)), "State must be provided"),
  pincode: z
    .string()
    .min(6, "Pincode must be 6 digits")
    .max(6, "Pincode must be 6 digits")
    .regex(/^\d+$/, "Pincode must contain only digits"),

  servicesoffered: z
    .union([z.string(), z.number()]) 
    .nullable() 
    .optional(),

  document_upload: z
    .any()
    .refine(
      (fileList) => fileList && fileList.length > 0,
      "Please upload a file."
    )
    .refine((fileList) => {
      const file = fileList[0];
      return (
        file &&
        ["application/pdf", "image/jpeg", "image/png"].includes(file.type)
      );
    }, "Only PDF, JPG, and PNG files are allowed."),
});

type FormValues = z.infer<typeof formSchema>;
type State = {
  states_id: number;
  name: string;
};
type Services = {
  service_id: number;
  name: string;
};

const Page = () => {
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        redirect("/login");
      }
    };
    fetchUser();
  }, []);
  const [states, setStates] = useState<State[]>([]);
  const [services, setServices] = useState<Services[]>([]);

  const [isToggled, setIsToggled] = useState(false);

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
  const maxFileSize = 2 * 1024 * 1024;
  const router = useRouter();


  const onSubmit = async (data: FormValues) => {
    try {
      const supabase = createClient();
  
      // Check for existing registration number
      if (data.business_registration_no) {
        const { data: existingServiceCenters, error: checkError } =
          await supabase
            .from("service_centers")
            .select("business_registration_no")
            .eq("business_registration_no", data.business_registration_no);
  
        if (checkError) {
          console.error(
            "Error checking business registration number:",
            checkError.message
          );
          alert("Error checking registration number. Please try again.");
          return;
        }
  
        if (existingServiceCenters && existingServiceCenters.length > 0) {
          alert("This business registration number already exists.");
          return;
        }
      }
  
      // File upload logic
      const file = data.document_upload?.[0];
      if (file) {
        if (file.size > maxFileSize) {
          alert("File size exceeds the 2MB limit.");
          return;
        }
  
        const sanitizedFileName = file.name
          .replace(/[^a-z0-9.]/gi, "_")
          .toLowerCase();
        const filePath = `documents/${Date.now()}_${sanitizedFileName}`;
        const { error: uploadError } = await supabase.storage
          .from("ServiceCenterDocs")
          .upload(filePath, file);
  
        if (uploadError) {
          console.error("Upload error details:", uploadError);
          alert(`Error uploading document: ${uploadError.message}`);
          return;
        }
  
        const { data: fileData } = supabase.storage
          .from("ServiceCenterDocs")
          .getPublicUrl(filePath);
  
        if (!fileData || !fileData.publicUrl) {
          alert("Unexpected error occurred while processing the document.");
          return;
        }
  
        data.document_upload = fileData.publicUrl;
      }
  
      // Generate a random password
      const generatedPassword = generateRandomPassword();
  
      // Create a new user in the Supabase auth table
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: generatedPassword,
      });
  
      if (authError) {
        console.error("Error creating user:", authError.message);
        alert("Error creating user account. Please try again.");
        return;
      }
  
      const userId = authData.user?.id;
  
      if (!userId) {
        console.error("Failed to retrieve user ID after signup.");
        alert("Unexpected error occurred. Please try again.");
        return;
      }
  
     
      const { state, servicesoffered, ...rest } = data;
      const payload = {
        ...rest,
        state_id: Number(state),
        services_id: servicesoffered ? Number(servicesoffered) : null,
        auth_id: userId,
        document_upload: data.document_upload, // File URL
      };
  
      
      const { data: insertedData, error } = await supabase
        .from("service_centers")
        .insert(payload)
        .select("service_center_id");
  
      if (error) {
        console.error("Error inserting data:", error.message);
        alert("Error submitting the form. Please try again.");
      } else {
        alert("Service Center added successfully!");
        router.push("/add-service-center/list");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Unexpected error occurred.");
    }
  };
  
  // Utility function to generate a random password
  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8); // Generates an 8-character random string
  };
  
  // const onSubmit = async (data: FormValues) => {
  //   try {
  //     const supabase = createClient();

  //     if (data.business_registration_no) {
  //       const { data: existingServiceCenters, error: checkError } =
  //         await supabase
  //           .from("service_centers")
  //           .select("business_registration_no")
  //           .eq("business_registration_no", data.business_registration_no);

  //       if (checkError) {
  //         console.error(
  //           "Error checking business registration number:",
  //           checkError.message
  //         );
  //         alert("Error checking registration number. Please try again.");
  //         return;
  //       }

  //       if (existingServiceCenters && existingServiceCenters.length > 0) {
  //         alert("This business registration number already exists.");
  //         return;
  //       }
  //     }

  //     const file = data.document_upload?.[0];
  //     if (file && file.size > maxFileSize) {
  //       alert("File size exceeds the 2MB limit.");
  //       return;
  //     }
  //     if (!file) {
  //       console.error("No file found in document_upload.");
  //       alert("Please upload a document before submitting.");
  //       return;
  //     }

  //     const sanitizedFileName = file.name
  //       .replace(/[^a-z0-9.]/gi, "_")
  //       .toLowerCase();
  //     const filePath = `documents/${Date.now()}_${sanitizedFileName}`;
  //     console.log("Uploading file to path:", filePath);

  //     // Upload the file
  //     const { error: uploadError } = await supabase.storage
  //       .from("ServiceCenterDocs")
  //       .upload(filePath, file);

  //     if (uploadError) {
  //       console.error("Upload error details:", uploadError);
  //       alert(`Error uploading document: ${uploadError.message}`);
  //       return;
  //     }

  //     const { data: fileData } = supabase.storage
  //       .from("ServiceCenterDocs")
  //       .getPublicUrl(filePath);

  //     if (!fileData || !fileData.publicUrl) {
  //       console.error("Error generating public URL: No file data returned.");
  //       alert("Unexpected error occurred while processing the document.");
  //       return;
  //     }

  //     console.log(
  //       "File uploaded successfully. Public URL:",
  //       fileData.publicUrl
  //     );

  //     const generatedPassword = generateRandomPassword();
  //     const saltRounds = 10;
  //     const hashedPassword = await bcrypt.hash(generatedPassword, saltRounds);

  //     const { state, servicesoffered, ...rest } = data;
  //     const payload = {
  //       ...rest,
  //       state_id: Number(state),
  //       services_id: servicesoffered ? Number(servicesoffered) : null,
      
  //       password: hashedPassword,
  //       document_upload: fileData.publicUrl, 
  //     };

  //     // Insert the payload into the database
  //     const { data: insertedData, error } = await supabase
  //       .from("service_centers")
  //       .insert(payload)
  //       .select("service_center_id");

  //     if (error) {
  //       console.error("Error inserting data:", error.message);
  //       alert("Error submitting the form. Please try again.");
  //     } else {
  //       alert("Form submitted successfully!");
  //       // const serviceCenterId = insertedData[0].service_center_id; // Extract the ID
  //       // router.push(`/add-service-center/edit/${serviceCenterId}`); // Redirect
  //       router.push("/add-service-center/index");
  //     }
  //   } catch (err) {
  //     console.error("Unexpected error:", err);
  //     alert("Unexpected error occurred.");
  //   }
  // };
  const handleClose = (event: { preventDefault: () => void }) => {
    event.preventDefault(); // Prevent default form behavior
    router.push("/add-service-center/list"); // Navigate to the desired page
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("states").select("*");
        if (error) {
          console.error("Error fetching states:", error.message);
          return;
        }
        setStates(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchStates();
  }, []);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("service_centers_services_offerd")
          .select("*");
        if (error) {
          console.error("Error fetching services:", error.message);
          return;
        }
        setServices(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchServices();
  }, []);

  return (
    <main className="add_service_center_main">
      <Header />
      <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
        <div className="inner_left">
          <Sidemenu onToggle={toggleClass} />
        </div>
        <div className="inner_right">
        <HeadingBredcrum
                        heading="Add Service Center"
                        breadcrumbs={[
                            { label: 'Home', link: '/', active: false },
                            { label: 'Add Service Center', active: true },
                        ]}
                    />
          <div className="add_service_formbox">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="service_form_heading">Basic Information</div>
              <div className="inner_form_group">
                <label htmlFor="name">
                  Service Center Name <span>*</span>
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
                <label htmlFor="business_registration_no">
                  Registration Number
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("business_registration_no")}
                  id="business_registration_no"
                />
                {errors.business_registration_no && (
                  <p className="erro_message">
                    {errors.business_registration_no.message}
                  </p>
                )}
              </div>
              <div className="inner_form_group">
                <label htmlFor="servicesoffered">Services Offered</label>
                <select
                  className="form-control"
                  {...register("servicesoffered")} // Registers the field
                  id="servicesoffered"
                >
                  <option value="">No service selected</option>{" "}
                  {/* Default empty value */}
                  {services.map((service) => (
                    <option key={service.service_id} value={service.service_id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {errors.servicesoffered && (
                  <p className="erro_message">
                    {errors.servicesoffered.message}
                  </p>
                )}
                <div className="down_arrow_btn">
                  <img
                    src="/images/angle-small-down.svg"
                    alt="Arrow"
                    className="img-fluid"
                  />
                </div>
              </div>

              <div className="inner_form_group">
                <label htmlFor="service_area">
                  Service Area <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("service_area")}
                  id="service_area"
                />
                {errors.service_area && (
                  <p className="erro_message">{errors.service_area.message}</p>
                )}
              </div>

              <div className="inner_form_group">
                <label htmlFor="document_upload">
                  Upload Document <span>*</span> (max 2mb doc,pdf, jpg, png)
                </label>
                <input
                  className="form-control"
                  type="file"
                  {...register("document_upload")}
                  id="document_upload"
                />
                {errors.document_upload && (
                  <p className="erro_message">
                    {(errors.document_upload as FieldError).message}
                  </p>
                )}
              </div>

              <div className="inner_form_group">
                <label htmlFor="primary_contact_person">
                  Contact Person <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("primary_contact_person")}
                  id="primary_contact_person"
                />
                {errors.primary_contact_person && (
                  <p className="erro_message">
                    {errors.primary_contact_person.message}
                  </p>
                )}
              </div>
              <div className="inner_form_group">
                <label htmlFor="contact_number">
                  Contact Number <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("contact_number")}
                  id="contact_number"
                />
                {errors.contact_number && (
                  <p className="erro_message">
                    {errors.contact_number.message}
                  </p>
                )}
              </div>
              <div className="inner_form_group">
                <label htmlFor="email">
                  Email <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("email")}
                  id="email"
                />
                {errors.email && (
                  <p className="erro_message">{errors.email.message}</p>
                )}
              </div>
              <div className="inner_form_group">
                <label htmlFor="alternate_contact">
                  Alternate Contact Number
                </label>
                <input
                  className="form-control"
                  {...register("alternate_contact")}
                  type="text"
                  name="alternate_contact"
                  id="alternate_contact"
                />
                {errors.alternate_contact && (
                  <p className="erro_message">
                    {errors.alternate_contact.message}
                  </p>
                )}
              </div>
              <div className="service_form_heading service_form_heading_second">
                Address
              </div>
              <div className="inner_form_group">
                <label htmlFor="address">
                  Address <span>*</span>
                </label>
                <textarea
                  className="form-control"
                  {...register("address")}
                  id="address"
                  rows={1}
                ></textarea>
                {errors.address && (
                  <p className="erro_message">{errors.address.message}</p>
                )}
              </div>
              <div className="inner_form_group">
                <label htmlFor="city">
                  City <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("city")}
                  id="city"
                />
                {errors.city && (
                  <p className="erro_message">{errors.city.message}</p>
                )}
              </div>

              <div className="inner_form_group">
                <label htmlFor="state">
                  State <span>*</span>
                </label>
                <select
                  className="form-control"
                  {...register("state")}
                  id="state"
                >
                  <option value="">Select your state</option>
                  {states.map((state) => (
                    <option key={state.states_id} value={state.states_id}>
                      {state.name}
                    </option>
                  ))}
                </select>

                {errors.state && (
                  <p className="erro_message">{errors.state.message}</p>
                )}
              </div>
              <div className="inner_form_group">
                <label htmlFor="pincode">
                  Pincode <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("pincode")}
                  id="pincode"
                />
                {errors.pincode && (
                  <p className="erro_message">{errors.pincode.message}</p>
                )}
              </div>
              <div className="inner_form_group inner_form_group_submit">
                <input type="submit" className="submite_btn" value="Submit" />
                <input
                  type="button"
                  className="close_btn"
                  value="Close"
                  onClick={handleClose}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
const generateRandomPassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  const passwordLength = 8;
  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
};
