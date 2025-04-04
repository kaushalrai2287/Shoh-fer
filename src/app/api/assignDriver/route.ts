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
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const { booking_id, customer_latitude, customer_longitude } = body;

  
    const { data: drivers, error: driverError } = await supabase.rpc("find_nearest_driver", {
      lat: customer_latitude,
      lng: customer_longitude,
    });

    if (driverError || !drivers || drivers.length === 0) {
      return NextResponse.json({ message: "No available drivers found" }, { status: 404 });
    }

    const nearestDriver: Driver = drivers[0]; 

    
    // const { error: updateError } = await supabase
    //   .from("booking_locations")
    //   .update({ driver_id: nearestDriver.driver_id })
    //   .eq("booking_id", booking_id);

    // if (updateError) {
    //   return NextResponse.json({ message: "Error assigning driver", error: updateError }, { status: 500 });
    // }
  
    return NextResponse.json({
      message: "Driver assigned successfully",
      driver: nearestDriver,
    });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
