"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../../../../components/Header";
import Sidemenu from "../../../../../components/Sidemenu";
import { FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "../../../../../utils/supabase/client";
import bcrypt from "bcryptjs";

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
  email: z.string().email("Invalid email address").optional(),

  alternate_contact: z
    .string()
    .optional()
    .refine((value) => !value || /^\d{1,10}$/.test(value), {
      message:
        "Alternate Contact Number must contain only digits and be at most 10 digits long",
    }),

  address: z.string().min(1, "Address is required"),
  city: z
    .string()
    .min(1, "City is required")
    .regex(/^[a-zA-Z\s]+$/, "City must only contain letters"),
  state: z
    .union([z.string(), z.number()]) // Accepts both string and number
    .refine(
      (value) =>
        value !== "" &&
        value !== null &&
        value !== undefined &&
        /^\d+$/.test(String(value)),
      "State must be provided"
    ),

  pincode: z
    .string()
    .min(6, "Pincode must be 6 digits")
    .max(6, "Pincode must be 6 digits")
    .regex(/^\d+$/, "Pincode must contain only digits"),
  // servicesoffered: z
  // .string()
  // .optional()
  // .refine((value) => !value || value.trim() !== "", {
  //   message: "Services Offered is required when provided",
  // }),
  servicesoffered: z
    .union([z.string(), z.number()]) // Accepts string or number
    .nullable() // Allows null
    .optional(), // Makes it optional

  document_upload: z
    .any()
    .refine((fileList) => {
      // If fileList is empty, return false to trigger error
      return (
        (fileList && fileList.length > 0) || typeof fileList === "string" // Allow previously uploaded files
      );
    }, "Please upload a file.")
    .refine((fileList) => {
      if (typeof fileList === "string") return true; // Skip validation for existing file paths
      const file = fileList[0];
      return (
        file &&
        ["application/pdf", "image/jpeg", "image/png"].includes(file.type)
      );
    }, "Only PDF, JPG, and PNG files are allowed."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must include at least one special character"
    )
    .optional() // This makes the field optional
    .nullable() // Allows null values
    .refine(
      (value) => {
        // Check if value is either an empty string or meets the minimum length
        return value === "" || (typeof value === "string" && value.length >= 8);
      },
      {
        message: "Password must be at least 8 characters long if provided.",
      }
    ),
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

const EditPage = () => {
  const { id } = useParams();
  const [isToggled, setIsToggled] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [services, setServices] = useState<Services[]>([]);
  const [serviceCenterData, setServiceCenterData] = useState<FormValues | null>(
    null
  );
  const [statesLoading, setStatesLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();

  const toggleClass = () => {
    setIsToggled(!isToggled);
  };

  useEffect(() => {
    const fetchServiceCenter = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("service_centers")
          .select("*")
          .eq("service_center_id", id)
          .single();

        if (error) throw error;
        setServiceCenterData(data);

        setValue("name", data.name);
        setValue(
          "business_registration_no",
          data.business_registration_no || ""
        );
        setValue("service_area", data.service_area);
        setValue("primary_contact_person", data.primary_contact_person);
        setValue("contact_number", data.contact_number);
        setValue("email", data.email || "");
        setValue("alternate_contact", data.alternate_contact || "");
        setValue("address", data.address);
        setValue("city", data.city);
        setValue("state", data.state_id);
        setValue("pincode", data.pincode);
        setValue("servicesoffered", data.services_id);
        setValue("document_upload", data.document_upload || []);
        setValue("password", data.password);
      } catch (err) {
        console.error("Error fetching service center:", err);
      }
    };

    const fetchServices = async () => {
      setServicesLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("service_centers_services_offerd")
          .select("*");
        if (error) throw error;
        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setServicesLoading(false);
      }
    };

    const fetchStates = async () => {
      setStatesLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("states").select("*");
        if (error) throw error;
        setStates(data);
      } catch (err) {
        console.error("Error fetching states:", err);
      } finally {
        setStatesLoading(false);
      }
    };

    fetchServiceCenter();
    fetchStates();
    fetchServices();
  }, [id, setValue]);

  const maxFileSize = 2 * 1024 * 1024;
  const onSubmit = async (data: FormValues) => {
    try {
      const supabase = createClient();
      const file = data.document_upload?.[0];
      data.servicesoffered = data.servicesoffered || null;

      // File size validation (assuming maxFileSize is defined elsewhere, e.g., 2MB)
      if (file && file.size > maxFileSize) {
        alert("File size exceeds the 2MB limit.");
        return;
      }

      if (!file) {
        console.error("No file found in document_upload.");
        alert("Please upload a document before submitting.");
        return;
      }

      // const sanitizedFileName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
      const sanitizedFileName = (file?.name || "")
        .replace(/[^a-z0-9.]/gi, "_")
        .toLowerCase();

      const filePath = `documents/${Date.now()}_${sanitizedFileName}`;
      console.log("Uploading file to path:", filePath);

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
        console.error("Error generating public URL: No file data returned.");
        alert("Unexpected error occurred while processing the document.");
        return;
      }

      let encryptedPassword = null;
      if (data.password) {
        const saltRounds = 10;
        encryptedPassword = await bcrypt.hash(data.password, saltRounds);
      }

      const { error } = await supabase
        .from("service_centers")
        .update({
          name: data.name,
          business_registration_no: data.business_registration_no,
          service_area: data.service_area,
          primary_contact_person: data.primary_contact_person,
          contact_number: data.contact_number,
          email: data.email,
          alternate_contact: data.alternate_contact,
          address: data.address,
          city: data.city,
          state_id: data.state,
          pincode: data.pincode,
          services_id: data.servicesoffered,
          document_upload: fileData.publicUrl || [],

          ...(encryptedPassword && { password: encryptedPassword }),
        })
        .eq("service_center_id", id);

      if (error) {
        console.error("Error updating service center:", error);

        if (error.code === "23505") {
          // Example for duplicate key error (unique constraint violation)
          alert(
            "Duplicate entry error. A service center with the same identifier already exists."
          );
        } else if (error.code === "22001") {
          // Example for string too long error
          alert(
            "One of the fields exceeds the maximum length. Please check your inputs."
          );
        } else {
          alert(
            `An error occurred while updating the service center: ${error.message}`
          );
        }
        return;
      }

      // Confirm successful update and navigate to another page if needed
      alert("Service center updated successfully!");
      router.push("/add-service-center/index");
    } catch (err) {
      // Catch any unexpected errors
      console.error("Unexpected error while updating service center:", err);
      alert(
        "An unexpected error occurred while updating the service center. Please try again."
      );
    }
  };
  const handleClose = (event: { preventDefault: () => void }) => {
    event.preventDefault(); // Prevent default form behavior
    router.push("/add-service-center/index"); // Navigate to the desired page
  };

  return (
    <main className="edit_service_center_main">
      <Header />
      <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
        <div className="inner_left">
          <Sidemenu onToggle={toggleClass} />
        </div>
        <div className="inner_right">
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
                {servicesLoading ? (
                  <div>Loading services...</div>
                ) : (
                  <select
                    className="form-control"
                    {...register("servicesoffered")}
                  >
                    {services.map((service) => (
                      <option
                        key={service.service_id}
                        value={service.service_id}
                      >
                        {service.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.servicesoffered && (
                  <p className="erro_message">
                    {errors.servicesoffered.message}
                  </p>
                )}
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
                {serviceCenterData?.document_upload ? (
                  <div className="uploaded-document">
                    <p>
                      Current Document:{" "}
                      <a
                        href={serviceCenterData.document_upload}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Uploaded Document
                      </a>
                    </p>
                  </div>
                ) : (
                  <p>No document uploaded yet.</p>
                )}
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
                  type="email"
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
              <div className="inner_form_group">
                <label htmlFor="password">Change Password </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("password")}
                  id="password"
                />
                {errors.password && (
                  <p className="erro_message">{errors.password.message}</p>
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
                <label htmlFor="state">State</label>
                {statesLoading ? (
                  <div>Loading states...</div>
                ) : (
                  <select className="form-control" {...register("state")}>
                    {states.map((state) => (
                      <option key={state.states_id} value={state.states_id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                )}
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

export default EditPage;
