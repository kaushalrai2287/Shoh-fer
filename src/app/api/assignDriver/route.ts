// import { NextResponse } from "next/server";
// import { createClient } from "../../../../utils/supabase/client";


// interface AssignDriverRequest {
//   booking_id: number;
//   customer_latitude: number;
//   customer_longitude: number;
// }


// interface Driver {
//   driver_id: number;
//   latitude: number;
//   longitude: number;
//   distance: number;
// }


// const supabase = createClient();



// export async function POST(req: Request) {
//   try {
//     const body: AssignDriverRequest = await req.json();

//     if (!body.booking_id || !body.customer_latitude || !body.customer_longitude) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

//     const { booking_id, customer_latitude, customer_longitude } = body;

    
//     const { data: rejectedDrivers, error: rejectedError } = await supabase
//       .from("booking_assigned_drivers")
//       .select("driver_id")
//       .eq("booking_id", booking_id);

//     const rejectedIds = rejectedDrivers?.map((d) => d.driver_id) || [];

   
//     const { data: drivers, error: driverError } = await supabase.rpc("find_nearest_driver", {
//       lat: customer_latitude,
//       lng: customer_longitude,
//     });
//     // console.log("All drivers:", drivers);

//     if (driverError || !drivers || drivers.length === 0) {
//       return NextResponse.json({ message: "No available drivers found" }, { status: 404 });
//     }

    
//     const availableDrivers = drivers.filter(
//       (driver: Driver) => !rejectedIds.includes(driver.driver_id)
//     );

//     if (availableDrivers.length === 0) {
//       return NextResponse.json({ message: "No eligible drivers found" }, { status: 404 });
//     }

//     const nearestDriver = availableDrivers[0];

//     return NextResponse.json({
//       message: "Nearest driver found",
//       driver: nearestDriver,
//     });
//   } catch (error) {
//     return NextResponse.json({ message: "Server error", error }, { status: 500 });
//   }
// }
// import { NextResponse } from "next/server";
// import { createClient } from "../../../../utils/supabase/client";

// interface AssignDriverRequest {
//   booking_id: number;
//   customer_latitude: number;
//   customer_longitude: number;
// }

// interface Driver {
//   driver_id: number;
//   latitude: number;
//   longitude: number;
//   distance: number;
// }

// const supabase = createClient();

// export async function POST(req: Request) {
//   try {
//     const body: AssignDriverRequest = await req.json();

//     if (!body.booking_id || !body.customer_latitude || !body.customer_longitude) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

//     const { booking_id, customer_latitude, customer_longitude } = body;

//     // Fetch previously assigned (or rejected) drivers for the same booking
//     // const { data: rejectedDrivers, error: rejectedError } = await supabase
//     //   .from("booking_assigned_drivers")
//     //   .select("driver_id")
//     //   .eq("booking_id", booking_id);
//     const { data: rejectedDrivers, error: rejectedError } = await supabase
//   .from("booking_assigned_drivers")
//   .select("driver_id")
//   .eq("booking_id", booking_id)
//   .eq("status", "rejected");


//     if (rejectedError) {
//       return NextResponse.json({ message: "Error fetching assigned drivers", error: rejectedError }, { status: 500 });
//     }

//     const rejectedIds = rejectedDrivers?.map((d) => d.driver_id) || [];

//     // Call the stored procedure to find nearest drivers
//     const { data: drivers, error: driverError } = await supabase.rpc("find_nearest_driver", {
//       lat: customer_latitude,
//       lng: customer_longitude,
//     });

//     if (driverError || !drivers || drivers.length === 0) {
//       return NextResponse.json({ message: "No available drivers found" }, { status: 404 });
//     }

//     // Filter out already assigned drivers
//     const availableDrivers = drivers.filter(
//       (driver: Driver) => !rejectedIds.includes(driver.driver_id)
//     );

//     if (availableDrivers.length === 0) {
//       return NextResponse.json({ message: "No eligible drivers found" }, { status: 404 });
//     }

//     const nearestDriver = availableDrivers[0];

//     // Insert the driver into booking_assigned_drivers with 'pending' status
//     const { error: insertError } = await supabase
//       .from("booking_assigned_drivers")
//       .insert({
//         booking_id,
//         driver_id: nearestDriver.driver_id,
//         status: "pending",
//         pending_at: new Date()
//       });

//     if (insertError) {
//       return NextResponse.json({ message: "Failed to assign driver", error: insertError }, { status: 500 });
//     }

//     return NextResponse.json({
//       message: "Nearest driver found and assigned",
//       driver: nearestDriver,
//     });
//   } catch (error) {
//     return NextResponse.json({ message: "Server error", error }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/client";

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

const supabase = createClient();

export async function POST(req: Request) {
  try {
    const body: AssignDriverRequest = await req.json();

    if (!body.booking_id || !body.customer_latitude || !body.customer_longitude) {
      console.error("Missing required fields", body);
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const { booking_id, customer_latitude, customer_longitude } = body;
    console.log(`Assigning driver for booking ID: ${booking_id}`);

    // Fetch rejected drivers
    const { data: rejectedDrivers, error: rejectedError } = await supabase
      .from("booking_assigned_drivers")
      .select("driver_id")
      .eq("booking_id", booking_id)
      .eq("status", "rejected");

    if (rejectedError) {
      console.error("Error fetching rejected drivers:", rejectedError);
      return NextResponse.json({ message: "Error fetching assigned drivers", error: rejectedError }, { status: 500 });
    }

    const rejectedIds = rejectedDrivers?.map((d) => d.driver_id) || [];
    // console.log("Rejected driver IDs:", rejectedIds);

    // Call stored procedure to find nearest drivers
    const { data: drivers, error: driverError } = await supabase.rpc("get_available_drivers_by_segment", {
  target_booking_id: booking_id,
  lat: customer_latitude,
  lng: customer_longitude,
});
console.log("Drivers returned by stored procedure:", drivers);
    // const { data: drivers, error: driverError } = await supabase.rpc("get_available_drivers_by_segment", {
    //   lat: customer_latitude,
    //   lng: customer_longitude,
    // });
// find_nearest_driver
    if (driverError) {
      console.error("Error calling stored procedure 'find_nearest_driver':", driverError);
      return NextResponse.json({ message: "Error finding drivers", error: driverError }, { status: 500 });
    }

    if (!drivers || drivers.length === 0) {
      console.warn("No drivers found by stored procedure.");
      return NextResponse.json({ message: "No available drivers found" }, { status: 404 });
    }

    // console.log("Drivers returned by stored procedure:", drivers.map((d: Driver) => d.driver_id));

    // Filter out rejected drivers
    const availableDrivers = drivers.filter(
      (driver: Driver) => !rejectedIds.includes(driver.driver_id)
    );

    // console.log("Filtered available drivers:", availableDrivers.map((d: { driver_id: any; }) => d.driver_id));

    if (availableDrivers.length === 0) {
      console.warn("All drivers were rejected or unavailable.");
      return NextResponse.json({ message: "No eligible drivers found" }, { status: 404 });
    }

    const nearestDriver = availableDrivers[0];
    // console.log("Assigning nearest available driver:", nearestDriver.driver_id);

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
      return NextResponse.json({ message: "Failed to assign driver", error: insertError }, { status: 500 });
    }

    return NextResponse.json({
      message: "Nearest driver found and assigned",
      driver: nearestDriver,
    });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
