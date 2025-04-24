import { createClient } from "../supabase/client";

const supabase = createClient();

interface AssignDriverRequest {
  booking_id: number;
  customer_latitude: number;
  customer_longitude: number;
}

interface Driver {
  driver_id: number;
  latitude: number;
  longitude: number;
  distance: number;
}

interface AssignDriverResponse {
  message: string;
  driver?: Driver;
  error?: any;
}

export async function assignDriverToBooking(
  booking_id: number,
  customer_latitude: number,
  customer_longitude: number
): Promise<AssignDriverResponse> {
  try {
    if (!booking_id || !customer_latitude || !customer_longitude) {
      return { message: "Missing required fields" };
    }

    console.log(`Assigning driver for booking ID: ${booking_id}`);

    // Fetch rejected drivers
    const { data: rejectedDrivers, error: rejectedError } = await supabase
      .from("booking_assigned_drivers")
      .select("driver_id")
      .eq("booking_id", booking_id)
      .eq("status", "rejected");

    if (rejectedError) {
      console.error("Error fetching rejected drivers:", rejectedError);
      return { message: "Error fetching assigned drivers", error: rejectedError };
    }

    const rejectedIds = rejectedDrivers?.map((d) => d.driver_id) || [];

  
    const { data: drivers, error: driverError } = await supabase.rpc("find_nearest_driver", {
      lat: customer_latitude,
      lng: customer_longitude,
    });

    if (driverError) {
      console.error("Error calling stored procedure 'find_nearest_driver':", driverError);
      return { message: "Error finding drivers", error: driverError };
    }

    if (!drivers || drivers.length === 0) {
      console.warn("No drivers found by stored procedure.");
      return { message: "No available drivers found" };
    }

    // Filter out rejected drivers
    const availableDrivers = drivers.filter(
      (driver: Driver) => !rejectedIds.includes(driver.driver_id)
    );

    if (availableDrivers.length === 0) {
      console.warn("All drivers were rejected or unavailable.");
      return { message: "No eligible drivers found" };
    }

    const nearestDriver = availableDrivers[0];

    // Insert driver into booking_assigned_drivers
    const { error: insertError } = await supabase
      .from("booking_assigned_drivers")
      .insert({
        booking_id,
        driver_id: nearestDriver.driver_id,
        status: "pending",
        pending_at: new Date(),
      });

    if (insertError) {
      console.error("Failed to insert into booking_assigned_drivers:", insertError);
      return { message: "Failed to assign driver", error: insertError };
    }

    return {
      message: "Nearest driver found and assigned",
      driver: nearestDriver,
    };
  } catch (error) {
    console.error("Server error:", error);
    return { message: "Server error", error };
  }
}
// import { createClient } from "../supabase/client";

// const supabase = createClient();

// interface AssignDriverRequest {
//   booking_id: number;
//   customer_latitude: number;
//   customer_longitude: number;
//   brand: string; // now required
// }

// interface Driver {
//   driver_id: number;
//   latitude: number;
//   longitude: number;
//   distance: number;
//   brand: string; // added for brand
// }

// interface AssignDriverResponse {
//   message: string;
//   driver?: Driver;
//   error?: any;
// }

// export async function assignDriverToBooking(
//   booking_id: number,
//   customer_latitude: number,
//   customer_longitude: number,
//   brand: string // now required
// ): Promise<AssignDriverResponse> {
//   try {
//     const missingFields: string[] = [];
//     if (!booking_id) missingFields.push("booking_id");
//     if (!customer_latitude) missingFields.push("customer_latitude");
//     if (!customer_longitude) missingFields.push("customer_longitude");
//     if (!brand) missingFields.push("brand");

//     if (missingFields.length > 0) {
//       return { message: "Missing required fields", error: { missingFields } };
 
//     }

//     console.log(`Assigning driver for booking ID: ${booking_id} with brand: ${brand}`);

    
//     const { data: rejectedDrivers, error: rejectedError } = await supabase
//       .from("booking_assigned_drivers")
//       .select("driver_id")
//       .eq("booking_id", booking_id)
//       .eq("status", "rejected");

//     if (rejectedError) {
//       console.error("Error fetching rejected drivers:", rejectedError);
//       return { message: "Error fetching assigned drivers", error: rejectedError };
//     }

//     const rejectedIds = rejectedDrivers?.map((d) => d.driver_id) || [];

//     // Fetch drivers filtered by brand using the new function
//     const { data: drivers, error: driverError } = await supabase.rpc("get_drivers_by_brand", {
//       brand_name: brand,
//       lat: customer_latitude,
//       lng: customer_longitude,
//     });

//     if (driverError) {
//       console.error("Error calling stored procedure 'get_drivers_by_brand':", driverError);
//       return { message: "Error finding drivers", error: driverError };
//     }

//     if (!drivers || drivers.length === 0) {
//       console.warn("No drivers found by brand.");
      
      
//       const { data: fallbackDrivers, error: fallbackError } = await supabase.rpc("find_nearest_driver", {
//         lat: customer_latitude,
//         lng: customer_longitude,
//       });

//       if (fallbackError) {
//         console.error("Error calling stored procedure 'find_nearest_driver':", fallbackError);
//         return { message: "Error finding fallback drivers", error: fallbackError };
//       }

//       if (!fallbackDrivers || fallbackDrivers.length === 0) {
//         console.warn("No fallback drivers found.");
//         return { message: "No available drivers found" };
//       }

//       const nearestDriver = fallbackDrivers[0];

//       // Filter out rejected drivers
//       const availableDrivers = fallbackDrivers.filter(
//         (driver: Driver) => !rejectedIds.includes(driver.driver_id)
//       );

//       if (availableDrivers.length === 0) {
//         console.warn("All drivers were rejected or unavailable.");
//         return { message: "No eligible drivers found" };
//       }

//       const selectedDriver = availableDrivers[0];

//       // Insert driver into booking_assigned_drivers
//       const { error: insertError } = await supabase
//         .from("booking_assigned_drivers")
//         .insert({
//           booking_id,
//           driver_id: selectedDriver.driver_id,
//           status: "pending",
//           pending_at: new Date(),
//         });

//       if (insertError) {
//         console.error("Failed to insert into booking_assigned_drivers:", insertError);
//         return { message: "Failed to assign driver", error: insertError };
//       }

//       return {
//         message: "Nearest fallback driver found and assigned",
//         driver: selectedDriver,
//       };
//     }

//     // Filter out rejected drivers from brand-specific search results
//     const availableDrivers = drivers.filter(
//       (driver: Driver) => !rejectedIds.includes(driver.driver_id)
//     );

//     if (availableDrivers.length === 0) {
//       console.warn("All drivers were rejected or unavailable.");
//       return { message: "No eligible drivers found" };
//     }

//     const nearestDriver = availableDrivers[0];

//     // Insert driver into booking_assigned_drivers
//     const { error: insertError } = await supabase
//       .from("booking_assigned_drivers")
//       .insert({
//         booking_id,
//         driver_id: nearestDriver.driver_id,
//         status: "pending",
//         pending_at: new Date(),
//       });

//     if (insertError) {
//       console.error("Failed to insert into booking_assigned_drivers:", insertError);
//       return { message: "Failed to assign driver", error: insertError };
//     }

//     return {
//       message: "Nearest driver found and assigned",
//       driver: nearestDriver,
//     };
//   } catch (error) {
//     console.error("Server error:", error);
//     return { message: "Server error", error };
//   }
// }
