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
