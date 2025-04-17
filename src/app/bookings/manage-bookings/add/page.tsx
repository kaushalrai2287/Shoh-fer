"use client";

import React, { useEffect, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Header from "../../../../../components/Header";
import Sidemenu from "../../../../../components/Sidemenu";
import { createClient } from "../../../../../utils/supabase/client";
import HeadingBredcrum from "../../../../../components/HeadingBredcrum";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";
import { FaCalendarAlt } from "react-icons/fa";




const formSchema = z.object({
  b_type: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "model is required"),
  s_list: z.string().min(1, "model is required"),
  cnumber: z
    .string()
    .regex(/^\d+$/, "Contact Number must contain only digits")
    .min(10, "Contact Number must be at least 10 digits")
    .max(10, "Contact Number must be at most 10 digits"),
  name: z
    .string()
    .min(1, "Vehicle Number is required")
    .regex(
      /^[a-zA-Z\s0-9]+$/,
      "Vehicle Number must contain only letters and numbers"
    ), // Adjust as needed
  cperson: z
    .string()
    .min(1, "Customer Name is required")
    .regex(/^[a-zA-Z\s]+$/, "Customer Name must only contain letters"),
  p_location: z.string().min(1, "Pick Up Location is required"),
  d_location: z.string().min(1, "Drop Location is required"),
  p_lat: z.string().min(1, "Pick Up Latitude is required"),
  p_lng: z.string().min(1, "Pick Up Longitude is required"),
  d_lat: z.string().min(1, "Drop Latitude is required"),
  d_lng: z.string().min(1, "Drop Longitude is required"),
  pickup_date_time:z.string().min(1, "Pick Up Date and Time is required"),
  // p_date: z.string().min(1, "Pick Up Date and Time is required"),
  p_experience: z.string().min(1, "exp required"),
  driver_select: z.string(),
  vehicle_condition: z.string(),

  //new field
  Customer_Email: z.string().email("customer email address").optional(),
  Secondary_Contact_Number: z
  .string()
  .regex(/^\d+$/, "Phone must contain only digits")
  .min(10, "Phone number must be 10 digits")
  .max(10, "Phone number must be 10 digits").optional(),
  special_instructions: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
const router = useRouter;

const AddBookings = () => {
  const [isToggled, setIsToggled] = useState(false); // State for toggle
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [models, setModels] = useState<
    { id: string; brand_id: string; name: string }[]
  >([]);
  const [serviceCenters, setServiceCenters] = useState<
    { service_center_id: string; name: string }[]
  >([]);
  const [drivers, setDrivers] = useState<
    { driver_id: string; driver_name: string }[]
  >([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  console.log(errors);

  const toggleClass = () => {
    setIsToggled(!isToggled); // Toggle the state
  };

  // Fetch Brands on Page Load
  useEffect(() => {
    const fetchBrands = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("brands").select("id, name");
      if (error) console.error("Error fetching brands:", error);
      else setBrands(data || []);
    };
    fetchBrands();
  }, []);

  // Fetch Models based on Selected Brand
  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedBrand) return;
      const supabase = createClient();
      const { data, error } = await supabase
        .from("models")
        .select("id, brand_id, name") // Include brand_id here
        .eq("brand_id", selectedBrand);
      if (error) console.error("Error fetching models:", error);
      else setModels(data || []);
    };

    fetchModels();
  }, [selectedBrand]);

  useEffect(() => {
    const fetchServiceCenters = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("service_centers")
        .select("service_center_id, name"); // Assuming the table name is "service_centers"
      if (error)
        console.error("Error fetching service centers:", error.message);
      else setServiceCenters(data || []);
    };
    fetchServiceCenters();
  }, []);
  useEffect(() => {
    const fetchDrivers = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("drivers")
        .select("driver_id, driver_name"); // Assuming the table is 'drivers'
      if (error) console.error("Error fetching drivers:", error);
      else setDrivers(data || []);
    };
    fetchDrivers();
  }, []);
  const router = useRouter();
  const onSubmit = async (data: FormValues) => {
    try {
      const supabase = createClient();
  
      // Step 1: Check if vehicle with same license plate exists
      const { data: existingVehicle, error: fetchError } = await supabase
        .from("vehicles")
        .select("vehicle_id")
        .eq("license_plate_no", data.name)
        .single();
  
      let vehicle_id: string;
  
      if (fetchError && fetchError.code !== "PGRST116") {
        // "PGRST116" = No rows found, which is fine
        console.error("Error checking existing vehicle:", fetchError.message);
        return;
      }
  
      if (existingVehicle) {
        // Vehicle already exists, use the existing vehicle_id
        vehicle_id = existingVehicle.vehicle_id;
      } else {
        // Step 2: Insert new vehicle
        const { data: newVehicle, error: insertError } = await supabase
          .from("vehicles")
          .insert([
            {
              brand_id: data.b_type,
              model_id: data.model,
              license_plate_no: data.name,
              condition: data.vehicle_condition,
              service_center_id: data.s_list,
            },
          ])
          .select("vehicle_id")
          .single();
  
        if (insertError) {
          console.error("Vehicle Insert Error:", insertError.message);
          return;
        }
  
        vehicle_id = newVehicle.vehicle_id;
      }
  
      // Step 3: Insert booking
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .insert([
          {
            vehicle_id,
            customer_name: data.cperson,
            customer_email: data.Customer_Email,
            customer_phone: data.cnumber,
            pickup_date_time:data.pickup_date_time,
            pickup_address: data.p_location,
            dropoff_address: data.d_location,
            special_instructions: data.special_instructions,
            driver_id: data.driver_select,
            Alternate_contact_no: data.Secondary_Contact_Number,
            service_center_id: data.s_list,
          },
        ])
        .select("booking_id")
        .single();
  
      if (bookingError) {
        console.error("Booking Insert Error:", bookingError.message);
        return;
      }
  
      const booking_id = bookingData.booking_id;
  
      // Step 4: Insert booking location
      const { error: locationError } = await supabase
        .from("booking_locations")
        .insert([
          {
            booking_id,
            customer_latitude: data.p_lat,
            customer_longitude: data.p_lng,
            dropoff_lat: data.d_lat,
            dropoff_lng: data.d_lng,
          },
        ]);
  
      if (locationError) {
        console.error("Booking Location Insert Error:", locationError.message);
        return;
      }
  
      alert("Booking successfully added!");
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  
//   const onSubmit = async (data: FormValues) => {
//     // console.log("Form data submitted:", data); // Debug log
//     try {
//       const supabase = createClient();

//       const { data: vehicleData, error: vehicleError } = await supabase
//         .from("vehicles")
//         .insert([
//           {
//             brand_id: data.b_type,
//             model_id: data.model,
//             license_plate_no: data.name,
//             condition: data.vehicle_condition,
//             service_center_id: data.s_list,
//           },
//         ])
//         .select("vehicle_id")
//         .single();

//       if (vehicleError) {
//         console.error("Vehicle Insert Error:", vehicleError.message);
//         return;
//       }
//     //   console.log("Vehicle data inserted:", vehicleData);

//       // Proceed to bookings table
//       const vehicle_id = vehicleData.vehicle_id;

//     //   const { error: bookingError } = await supabase.from("bookings").insert([
//     //     {
//     //       vehicle_id,
//     //       customer_name: data.cperson,
//     //       customer_phone: data.cnumber,
//     //       pickup_address: data.p_location,
//     //       dropoff_address: data.d_location,
//     //       driver_id: data.driver_select,
//     //       // pickup_date: data.p_date,
//     //       service_center_id: data.s_list,
//     //     },
//     //   ])
//     const { data: bookingData, error: bookingError } = await supabase
//     .from("bookings")
//     .insert([
//       {
//         vehicle_id,
//         customer_name: data.cperson,
//         customer_phone: data.cnumber,
//         pickup_address: data.p_location,
//         dropoff_address: data.d_location,
//         driver_id: data.driver_select,
//         service_center_id: data.s_list,
//       },
//     ])
//     .select("booking_id") // Fetch booking ID after insert
//     .single();

//       if (bookingError) {
//         console.error("Booking Insert Error:", bookingError.message);
//         return;
//       }
//       const booking_id = bookingData.booking_id;

//       const { error: locationError } = await supabase.from("booking_locations").insert([
//         {
//           booking_id,
//           customer_latitude: data.p_lat,
//           customer_longitude: data.p_lng,
//           dropoff_lat: data.d_lat,
//           dropoff_lng: data.d_lng,
//         },
//       ]);
      
//       if (locationError) {
//         console.error("Booking Location Insert Error:", locationError.message);
//         return;
//       }

//       alert("Booking successfully added!");
//     } catch (error) {
//       console.error("Unexpected error:", error);
//     }
//   };

  const handleClose = (event: { preventDefault: () => void }) => {
    event.preventDefault(); // Prevent default form behavior
    router.push("/bookings/manage-bookings/list"); // Navigate to the desired page
  };

  return (
    <main className="add_service_center_main">
      <Header />
      <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
        <div className="inner_left">
          <Sidemenu onToggle={toggleClass} />
        </div>
        <div className="inner_right">
          <HeadingBredcrum
            heading="Add Booking"
            breadcrumbs={[
              { label: "Home", link: "/", active: false },
              { label: "Add Booking", active: true },
            ]}
          />
          <div className="add_service_formbox">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="service_form_heading">Basic Information</div>
              <div className="inner_form_group">
                <label htmlFor="b_type">
                  Brand <span>*</span>
                </label>

                <select
                  className="form-control"
                  {...register("b_type")}
                  id="b_type"
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setValue("model", ""); // Reset model selection
                  }}
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {errors.b_type && (
                  <p className="erro_message">{errors.b_type.message}</p>
                )}
                <div className="down_arrow_btn">
                  <img
                    src="/images/angle-small-down.svg"
                    alt=""
                    className="img-fluid"
                  />
                </div>
              </div>
              <div className="inner_form_group">
                <label htmlFor="model">Model</label>

                <select
                  className="form-control"
                  {...register("model")}
                  id="model"
                >
                  <option value="">Select Model</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <div className="down_arrow_btn">
                  <img
                    src="/images/angle-small-down.svg"
                    alt=""
                    className="img-fluid"
                  />
                </div>
              </div>
              <div className="inner_form_group">
                <label htmlFor="s_list">Service Center</label>
                <select
                  className="form-control"
                  {...register("s_list")}
                  id="s_list"
                >
                  <option value="">Select Service Center</option>
                  {serviceCenters.map((center) => (
                    <option
                      key={center.service_center_id}
                      value={center.service_center_id}
                    >
                      {center.name}
                    </option>
                  ))}
                </select>
                <div className="down_arrow_btn">
                  <img
                    src="/images/angle-small-down.svg"
                    alt=""
                    className="img-fluid"
                  />
                </div>
              </div>
              <div className="inner_form_group">
                <label htmlFor="cperson">
                  Customer Name <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("cperson")}
                  id="cperson"
                />
                {errors.cperson && (
                  <p className="erro_message">{errors.cperson.message}</p>
                )}
              </div>
              <div className="inner_form_group">
                <label htmlFor="cnumber">
                  Customer Phone Number <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("cnumber")}
                  id="cnumber"
                />
                {errors.cnumber && (
                  <p className="erro_message">{errors.cnumber.message}</p>
                )}
              </div>
              <div className="inner_form_group">
                    <label htmlFor="Customer_Email">Customer Email</label>
                    <input
                      className="form-control"
                      id="Customer_Email"
                      type="text"
                      {...register("Customer_Email")}
                    />
                    {errors.Customer_Email && (
                      <p className="erro_message">
                        {errors.Customer_Email.message}
                      </p>
                    )}
                  </div>
                  <div className="inner_form_group">
                    <label htmlFor="Secondary_Contact_Number">
                      Secondary Contact Number
                    </label>
                    <input
                      className="form-control"
                      id="Secondary_Contact_Number"
                      type="text"
                      {...register("Secondary_Contact_Number")}
                    />
                    {errors.Secondary_Contact_Number && (
                      <p className="erro_message">
                        {errors.Secondary_Contact_Number.message}
                      </p>
                    )}
                  </div>
              <div className="inner_form_group">
                <label htmlFor="name">
                  Vehicle Number <span>*</span>
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
                <label htmlFor="vehicle_condition">Vehicle Condition</label>
                <textarea
                  className="form-control"
                  {...register("vehicle_condition")}
                  name="vehicle_condition"
                  id="vehicle_condition"
                  rows={1}
                ></textarea>
              </div>
              
              <div className="inner_form_group">
  <label htmlFor="pickup_date_time">
    Pickup Date Time <span>*</span>
  </label>
  <Controller
  control={control}
  name="pickup_date_time"
  rules={{ required: "Pickup date and time is required" }}
  render={({ field }) => {
    const value = field.value ? new Date(field.value) : null;
    const isValidDate = value instanceof Date && !isNaN(value.getTime());

    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 5); // today + 5 days

    return (
      <DatePicker
        placeholderText="Select pickup date and time"
        selected={isValidDate ? value : null}
        onChange={(date) => field.onChange(date?.toISOString())}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="MMMM d, yyyy h:mm aa"
        className="form-control"
        id="pickup_date_time"
        minDate={today}
        maxDate={maxDate}
        popperPlacement="bottom-start"
        portalId="root-portal"
      />
    );
  }}
/>



  {errors.pickup_date_time && (
    <p className="erro_message">{errors.pickup_date_time.message}</p>
  )}
    <div className="down_arrow_btn">
                  <img
                    src="/images/angle-small-down.svg"
                    alt=""
                    className="img-fluid"
                  />
                </div>
  
</div>

              <div className="inner_form_group">
                <label htmlFor="p_location">
                  Pick Up Location <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("p_location")}
                  id="p_location"
                />
                {errors.p_location && (
                  <p className="erro_message">{errors.p_location.message}</p>
                )}
              </div>
              <div className="inner_form_group">
                <label htmlFor="p_lat">
                  Pick Up Latitude <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("p_lat")}
                  id="p_lat"
                />
                {errors.p_lat && (
                  <p className="erro_message">{errors.p_lat.message}</p>
                )}
              </div>

              <div className="inner_form_group">
                <label htmlFor="p_lng">
                  Pick Up Longitude <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("p_lng")}
                  id="p_lng"
                />
                {errors.p_lng && (
                  <p className="erro_message">{errors.p_lng.message}</p>
                )}
              </div>
              <div className="inner_form_group">
                <label htmlFor="d_location">
                  Drop Location <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("d_location")}
                  id="d_location"
                />
                {errors.d_location && (
                  <p className="erro_message">{errors.d_location.message}</p>
                )}
              </div>

              <div className="inner_form_group">
                <label htmlFor="d_lat">
                  Drop Latitude <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("d_lat")}
                  id="d_lat"
                />
                {errors.d_lat && (
                  <p className="erro_message">{errors.d_lat.message}</p>
                )}
              </div>

              <div className="inner_form_group">
                <label htmlFor="d_lng">
                  Drop Longitude <span>*</span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...register("d_lng")}
                  id="d_lng"
                />
                {errors.d_lng && (
                  <p className="erro_message">{errors.d_lng.message}</p>
                )}
              </div>
              <div className="inner_form_group">
                    <label htmlFor="special_instructions">
                      Special Instructions
                    </label>
                    <input
                      className="form-control"
                      id="special_instructions"
                      type="text"
                      placeholder="Entry Code, Parking details etc"
                      {...register("special_instructions")}
                    />
                  </div>

              <div className="inner_form_group">
                <label htmlFor="driver_select">Driver Select</label>
                <select
                  className="form-control"
                  {...register("driver_select")}
                  id="driver_select"
                  name="driver_select"
                >
                  <option value="">Select Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.driver_id} value={driver.driver_id}>
                      {driver.driver_name}
                    </option>
                  ))}
                </select>
                <div className="down_arrow_btn">
                  <img
                    src="/images/angle-small-down.svg"
                    alt=""
                    className="img-fluid"
                  />
                </div>
              </div>
              <div className="inner_form_group">
                <label htmlFor="p_experience">Previous Experience</label>
                <input
                  className="form-control"
                  {...register("p_experience")}
                  type="text"
                  name="p_experience"
                  id="p_experience"
                />
              </div>
              <div className="inner_form_group">
                <label htmlFor="driver_rating">Driver Rating</label>
                <select
                  className="form-control"
                  id="driver_rating"
                  name="driver_rating"
                >
                  <option value="">Select Rating</option>
                  <option value="rone">1 Star</option>
                  <option value="rtwo">2 Star</option>
                  <option value="rthree">3 Star</option>
                  <option value="rfour">4 Star</option>
                  <option value="rfive">5 Star</option>
                </select>
                <div className="down_arrow_btn">
                  <img
                    src="/images/angle-small-down.svg"
                    alt=""
                    className="img-fluid"
                  />
                </div>
              </div>
              <div className="inner_form_group inner_form_group_submit">
                <input type="submit" className="submite_btn" value="Submit" />
                <input
                  type="button"
                  className="close_btn"
                  value="Close"
                  onClick={handleClose}
                />
                {/* <input type="submit" className='close_btn' value="Close" /> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddBookings;
