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

// export async function POST(req: Request) {
//   try {
//     const body: AssignDriverRequest = await req.json();

//     if ( !body.customer_latitude || !body.customer_longitude) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

//     const {  customer_latitude, customer_longitude } = body;

  
//     const { data: drivers, error: driverError } = await supabase.rpc("find_nearest_driver", {
//       lat: customer_latitude,
//       lng: customer_longitude,
//     });

//     if (driverError || !drivers || drivers.length === 0) {
//       return NextResponse.json({ message: "No available drivers found" }, { status: 404 });
//     }

//     const nearestDriver: Driver = drivers[0]; 

   
//     return NextResponse.json({
//       message: "Nearest driver found",
//       driver: nearestDriver,
//     });
//   } catch (error) {
//     return NextResponse.json({ message: "Server error", error }, { status: 500 });
//   }
// }


export async function POST(req: Request) {
  try {
    const body: AssignDriverRequest = await req.json();

    if (!body.booking_id || !body.customer_latitude || !body.customer_longitude) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const { booking_id, customer_latitude, customer_longitude } = body;

    
    const { data: rejectedDrivers, error: rejectedError } = await supabase
      .from("booking_rejected_drivers")
      .select("driver_id")
      .eq("booking_id", booking_id);

    const rejectedIds = rejectedDrivers?.map((d) => d.driver_id) || [];

   
    const { data: drivers, error: driverError } = await supabase.rpc("find_nearest_driver", {
      lat: customer_latitude,
      lng: customer_longitude,
    });
    // console.log("All drivers:", drivers);

    if (driverError || !drivers || drivers.length === 0) {
      return NextResponse.json({ message: "No available drivers found" }, { status: 404 });
    }

    
    const availableDrivers = drivers.filter(
      (driver: Driver) => !rejectedIds.includes(driver.driver_id)
    );

    if (availableDrivers.length === 0) {
      return NextResponse.json({ message: "No eligible drivers found" }, { status: 404 });
    }

    const nearestDriver = availableDrivers[0];

    return NextResponse.json({
      message: "Nearest driver found",
      driver: nearestDriver,
    });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
