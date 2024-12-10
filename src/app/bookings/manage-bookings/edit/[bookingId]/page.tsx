"use client";

import React, { useEffect, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Header from "../../../../../../components/Header";
import Sidemenu from "../../../../../../components/Sidemenu";
import { useRouter, useParams } from "next/navigation";

import { createClient } from "../../../../../../utils/supabase/client";
const formSchema = z.object({
  b_type: z.string().min(1, "Brand is required"),
  model: z.string().optional(), // Add model here
  s_list: z.string().optional(), // Add service center
  driver_select: z.string().optional(), // Add driver selection
  vehicle_condition: z.string().optional(), // Add vehicle condition
  cnumber: z
    .string()
    .regex(/^\d+$/, "Contact Number must contain only digits")
    .min(10, "Contact Number must be at least 10 digits")
    .max(10, "Contact Number must be at most 10 digits"),
  Vehicle_Number: z
    .string()
    .min(1, "Vehicle Number is required")
    .regex(/^[a-zA-Z\s0-9]+$/, "Only letters and numbers allowed"),
  cperson: z
    .string()
    .min(1, "Customer Name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),
  p_location: z.string().min(1, "Pick Up Location is required"),
  d_location: z.string().min(1, "Drop Location is required"),
  p_experience:z.string().min(1, "experince is required")
});


type FormValues = z.infer<typeof formSchema>;

const EditBookings = () => {
  const { bookingId } = useParams();
  const [isToggled, setIsToggled] = useState(false);
  // const [brandName, setBrandName] = useState(""); // State to hold the brand name

  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [models, setModels] = useState<
    { id: string; brand_id: string; name: string }[]
  >([]);
  const [serviceCenters, setServiceCenters] = useState<
    { service_center_id: string; name: string }[]
  >([]); // Service center state
  const [selectedBrand, setSelectedBrand] = useState(""); // State to track selected brand
  const [drivers, setDrivers] = useState<
    { driver_id: string; driver_name: string }[]
  >([]);
  const [loading, setLoading] = useState(false); // Loading state
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const toggleClass = () => {
    setIsToggled(!isToggled); // Toggle the state
  };

  useEffect(() => {
    const fetchBrands = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("brands").select("id, name");

      if (error) {
        console.error("Error fetching brands:", error.message);
      } else {
        setBrands(data || []);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchServiceCenters = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("service_centers")
        .select("service_center_id, name");
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

  const fetchModels = async (brandId: string, modelId = null) => {
    if (!brandId) {
      setModels([]); // Reset models if no brand is selected
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("models")
      .select("id, brand_id, name")
      .eq("brand_id", brandId);

    if (error) {
      console.error("Error fetching models:", error.message);
    } else {
      setModels(data || []);
    }
  };

  // Fetch booking data when bookingId changes
  useEffect(() => {
    const fetchBookingData = async () => {
      const supabase = createClient();

      if (!bookingId) {
        console.error("Booking ID is undefined or missing.");
        return;
      }

      setLoading(true); // Start loading
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          service_centers(name),
          drivers(*),
          vehicles(*, brands(*), models(*))
        `)
        .eq("booking_id", bookingId)
        .single();

      if (error) {
        console.error("Error fetching booking data:", error.message);
      } else if (data) {
        const brandId = data.vehicles?.brands?.id;
        const modelId = data.vehicles?.models?.id;

        // Set form values
        setValue("b_type", brandId);
        setValue("model", modelId);
        setSelectedBrand(brandId);
        setValue("cperson", data.customer_name);
        setValue("cnumber", data.customer_phone);
        setValue("p_location", data.pickup_address);
        setValue("d_location", data.dropoff_address);
        setValue("s_list", data.service_center_id || "");
        setValue("driver_select", data.driver_id || "");
        setValue("vehicle_condition", data.vehicles?.condition);
        setValue("Vehicle_Number", data.vehicles?.license_plate_no);
        setValue("p_experience", data.drivers?.experience_years);

        // Fetch models for the selected brand
        await fetchModels(brandId, modelId);
      }

      setLoading(false); // End loading
    };

    fetchBookingData();
  }, [bookingId]);

  // Fetch models when selectedBrand changes
  useEffect(() => {
    fetchModels(selectedBrand);
  }, [selectedBrand]);
  // useEffect(() => {
  //   const fetchBookingData = async () => {
  //     const supabase = createClient();
  //     if (!bookingId) {
  //       console.error("Booking ID is undefined or missing.");
  //       return;
  //     }
  
  //     setLoading(true); // Start loading
  //     const { data, error } = await supabase
  //       .from("bookings")
  //       .select(`
  //         *,
  //         service_centers(name),
  //         drivers(*),
  //         vehicles(*, brands(*), models(*))
  //       `)
  //       .eq("booking_id", bookingId)
  //       .single();


  //       // console.log(data.vehicles?.condition)
  
  //     if (error) {
  //       console.error("Error fetching booking data:", error.message);
  //     } else if (data) {
  //       const brandId = data.vehicles?.brands?.id;
  //       const modelId = data.vehicles?.models?.id;
  
  //       // Set brand, model, and other fields
  //       setValue("b_type", brandId);
  //       setValue("model", modelId);
  //       setSelectedBrand(brandId); // Set the brand and trigger model fetching
  //       setValue("cperson", data.customer_name);
  //       setValue("cnumber", data.customer_phone);
  //       setValue("p_location", data.pickup_address);
  //       setValue("d_location", data.dropoff_address);
  //       setValue("s_list", data.service_center_id || "");
  //       setValue("driver_select", data.driver_id || "");
  //       setValue("vehicle_condition",data.vehicles?.condition);
  //       setValue("Vehicle_Number", data.vehicles?.license_plate_no);
  //       setValue("p_experience",data.drivers?.experience_years)
  
  //       // Fetch models for the selected brand immediately
  //       await fetchModels(brandId, modelId);
  //     }
  //     setLoading(false);
  //   };
  
  //   const fetchModels = async (brandId: string, modelId?: string) => {
  //     if (!brandId) return;
  //     const supabase = createClient();
  //     const { data, error } = await supabase
  //       .from("models")
  //       .select("id, brand_id, name")
  //       .eq("brand_id", brandId);
  
  //     if (error) {
  //       console.error("Error fetching models:", error.message);
  //     } else {
  //       setModels(data || []);
  //       if (modelId) setValue("model", modelId); // Ensure model is set after fetching
  //     }
  //   };
  
  //   fetchBookingData();
  // }, [bookingId]);

  // const onSubmit = async (data: FormValues) => {
  //   try {
  //     const supabase = createClient();
  //     setLoading(true);
  
  //     // 1. Update Vehicle Table with Brand and Model
  //     const { error: vehicleError } = await supabase
  //       .from("vehicles")
  //       .update({
  //         brand_id: data.b_type, // Update brand
  //         model_id: data.model, // Update model
  //         license_plate_no: data.Vehicle_Number, // Update Vehicle Number
  //         condition: data.vehicle_condition, // Update condition
  //       })
  //       .eq("vehicle_id", bookingId); // Assuming vehicle_id is linked to bookingId
  
  //     if (vehicleError) {
  //       console.error("Error updating vehicle:", vehicleError.message);
  //       throw new Error("Failed to update vehicle details.");
  //     }
  
  //     // 2. Update Bookings Table with Other Fields
  //     const { error: bookingError } = await supabase
  //       .from("bookings")
  //       .update({
  //         customer_name: data.cperson,
  //         customer_phone: data.cnumber,
  //         pickup_address: data.p_location,
  //         dropoff_address: data.d_location,
  //         service_center_id: data.s_list,
  //         driver_id: data.driver_select,
  //       })
  //       .eq("booking_id", bookingId);
  
  //     if (bookingError) {
  //       console.error("Error updating booking:", bookingError.message);
  //       throw new Error("Failed to update booking details.");
  //     }
  
  //     console.log("Booking and Vehicle updated successfully!");
  //     alert("Booking updated successfully!");
  
  //   } catch (error: any) {
  //     console.error("Error:", error.message);
  //     alert("Failed to update booking. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const onSubmit = async (data: FormValues) => {
    try {
      const supabase = createClient();
      setLoading(true);
  
      // 1. Retrieve the vehicles_id from the bookings table
      const { data: bookingData, error: fetchError } = await supabase
        .from("bookings")
        .select("vehicle_id")
        .eq("booking_id", bookingId)
        .single();
  
      if (fetchError) {
        console.error("Error fetching vehicle ID:", fetchError.message);
        throw new Error("Failed to retrieve vehicle details.");
      }
  
      const vehicleId = bookingData?.vehicle_id; // Extract vehicles_id
  
      if (!vehicleId) {
        console.error("Vehicle ID not found for the booking.");
        throw new Error("Vehicle details not linked to this booking.");
      }
  
      // 2. Update Vehicle Table with Brand and Model
      const { error: vehicleError } = await supabase
        .from("vehicles")
        .update({
          brand_id: data.b_type, // Update brand
          model_id: data.model, // Update model
          license_plate_no: data.Vehicle_Number, // Update Vehicle Number
          condition: data.vehicle_condition, // Update condition
        })
        .eq("vehicle_id", vehicleId); // Use the retrieved vehicle_id
  
      if (vehicleError) {
        console.error("Error updating vehicle:", vehicleError.message);
        throw new Error("Failed to update vehicle details.");
      }
  
      // 3. Update Bookings Table with Other Fields
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({
          customer_name: data.cperson,
          customer_phone: data.cnumber,
          pickup_address: data.p_location,
          dropoff_address: data.d_location,
          service_center_id: data.s_list,
          driver_id: data.driver_select,
        })
        .eq("booking_id", bookingId);
  
      if (bookingError) {
        console.error("Error updating booking:", bookingError.message);
        throw new Error("Failed to update booking details.");
      }
  
      console.log("Booking and Vehicle updated successfully!");
      alert("Booking updated successfully!");
  
    } catch (error: any) {
      console.error("Error:", error.message);
      alert("Failed to update booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  
  // const onSubmit = (data: FormValues) => {
  //   console.log("Form Data:", data);
  // };

  return (
    <main className="add_service_center_main">
      <Header />
      <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
        <div className="inner_left">
          <Sidemenu onToggle={toggleClass} />
        </div>
        <div className="inner_right">
          <div className="add_service_formbox">
            {loading ? (
              <div className="loading-indicator">Loading...</div>
            ) : (
              <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className="service_form_heading">Basic Information</div>
                <div className="inner_form_group">
                  <label htmlFor="b_type">
                    Brand <span>*</span>
                  </label>

                  <select
                    className="form-control"
                    {...register("b_type")}
                    id="b_type"
                    onChange={(e) => setSelectedBrand(e.target.value)}
                     // Use `id` here
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {" "}
                   
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
                  <select className="form-control" {...register("s_list")}>
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
                  <label htmlFor="Vehicle_Number">
                    Vehicle Number <span>*</span>
                  </label>
                  <input
                    className="form-control"
                    {...register("Vehicle_Number")}
                    type="text"
                    id="Vehicle_Number"
                  />
                  {errors.Vehicle_Number && (
                    <p className="erro_message">{errors.Vehicle_Number.message}</p>
                  )}
                </div>
                <div className="inner_form_group">
                  <label htmlFor="vehicle_condition">Vehicle Condition</label>
                  <textarea
                    className="form-control"
                    // name="vehicle_condition"
                    {...register("vehicle_condition")}

                    id="vehicle_condition"
                    rows={1}
                  ></textarea>
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

                {/* <div className="inner_form_group">
                                    <label htmlFor="">Pickup Date</label>
                                    <input className="form-control" type="datetime-local" name="" id="" />
                                </div> */}
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
                  <label htmlFor="driver_select">Driver Select</label>
                  <select
                    className="form-control"
                    {...register("driver_select")}
                    id="driver_select"
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
                    type="text"
                    {...register("p_experience")}
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
                  <input type="submit" className="close_btn" value="Close" />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditBookings;
