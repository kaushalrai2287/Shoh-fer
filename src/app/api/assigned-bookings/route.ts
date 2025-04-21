// import { NextResponse } from "next/server";
// import { createClient } from "../../../../utils/supabase/client";

// const supabase = createClient();

// export async function POST(req: Request) {
//   try {
//     const { driver_id } = await req.json();

//     if (!driver_id) {
//       return NextResponse.json({ error: "Driver ID is required" }, { status: 400 });
//     }

//     // 1. Get all assigned bookings for this driver except rejected ones
//     const { data: assignments, error: assignError } = await supabase
//       .from("booking_assigned_drivers")
//       .select("*")
//       .eq("driver_id", driver_id)
//       .not("status", "eq", "rejected");

//     if (assignError) throw assignError;

//     if (!assignments || assignments.length === 0) {
//       return NextResponse.json({ bookings: [] }, { status: 200 });
//     }

//     // 2. Extract booking IDs
//     const bookingIds = assignments.map((a) => a.booking_id);

//     // 3. Fetch bookings manually using IDs
//     const { data: bookingsData, error: bookingError } = await supabase
//       .from("bookings")
//       .select("*")
//       .in("booking_id", bookingIds);

//     if (bookingError) throw bookingError;

//     // 4. Merge assignments with booking details
//     const merged = assignments.map(assign => {
//       const bookingDetails = bookingsData.find(b => b.booking_id === assign.booking_id);
//       return {
//         ...assign,
//       ... bookingDetails || null,
//       };
//     });

//     return NextResponse.json({ bookings: merged }, { status: 200 });

//   } catch (error) {
//     console.error("Error fetching assigned bookings:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// import { NextResponse } from "next/server";
// import { createClient } from "../../../../utils/supabase/client";
// import {haversineDistance} from "../../../../utils/distance"


// const supabase = createClient();

// export async function POST(req: Request) {
//   try {
//     const { driver_id } = await req.json();

//     if (!driver_id) {
//       return NextResponse.json({ error: "Driver ID is required" }, { status: 400 });



//     }


//     // 1. Get all assigned bookings for this driver except rejected ones
//     const { data: assignments, error: assignError } = await supabase
//       .from("booking_assigned_drivers")
//       .select("*")
//       .eq("driver_id", driver_id)
//       .not("status", "eq", "rejected");

//     if (assignError) throw assignError;

//     if (!assignments || assignments.length === 0) {
//       return NextResponse.json({ status: 0, message: "No bookings found" }, { status: 200 });
//     }

//     const assignment = assignments[0];

    
//     const { data: bookingData, error: bookingError } = await supabase
//       .from("bookings")
//       .select("*,booking_id")
//       .eq("booking_id", assignment.booking_id)
//       .single();

//     if (bookingError) throw bookingError;

//     const BookingID=  bookingData?.booking_id;
   
//     const{ data: bookingLatLong, error: bookingLatLongError } = await supabase
//     .from("booking_locations")
//     .select("customer_latitude, customer_longitude, dropoff_lat, dropoff_lng")
//     .eq("booking_id", BookingID)
//     .maybeSingle();


//     let distance_km = null;
//     if (
//       bookingLatLong?.customer_latitude &&
//       bookingLatLong?.customer_longitude &&
//       bookingLatLong?.dropoff_lat &&
//       bookingLatLong?.dropoff_lng
//     ) {
//       distance_km = haversineDistance(
//         bookingLatLong.customer_latitude,
//         bookingLatLong.customer_longitude,
//         bookingLatLong.dropoff_lat,
//         bookingLatLong.dropoff_lng
//       );
//     }


//     const { data: driverLoc, error: driverLocError } = await supabase
//     .from("drivers")
//     .select("latitude, longitude")
//     .eq("driver_id", driver_id)
//     .maybeSingle();

    
//     let driverPickupDistance = null;

// if (
//   bookingLatLong?.customer_latitude &&
//   bookingLatLong?.customer_longitude &&
//   driverLoc?.latitude &&
//   driverLoc?.longitude
// ) {
//   const custLat = parseFloat(bookingLatLong.customer_latitude);
//   const custLng = parseFloat(bookingLatLong.customer_longitude);
//   const driverLat = parseFloat(driverLoc.latitude);
//   const driverLng = parseFloat(driverLoc.longitude);

//   // console.log("Customer Location:", custLat, custLng);
//   // console.log("Driver Location:", driverLat, driverLng);

//   driverPickupDistance = haversineDistance(
//     driverLat,
//     driverLng,
//     custLat,
//     custLng
//   );
// }

    
//     const merged = {
//       ...assignment,
//       ...bookingLatLong,
//       ...(bookingData || {}),
//        distance_km: distance_km ? parseFloat(distance_km.toFixed(2)) : null,
//        driver_pickup_distance_km: driverPickupDistance ? parseFloat(driverPickupDistance.toFixed(2)) : null
//     };

//     return NextResponse.json({ status: 1, data: merged }, { status: 200 });

//   } catch (error) {
//     console.error("Error fetching assigned booking:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/client";
import { haversineDistance } from "../../../../utils/distance";

const supabase = createClient();

export async function POST(req: Request) {
  try {
    const { driver_id } = await req.json();

    if (!driver_id) {
      return NextResponse.json({ error: "Driver ID is required" }, { status: 400 });
    }

    // 1. Check if the driver has already rejected the booking
    const { data: rejectedAssignments, error: rejectedError } = await supabase
      .from("booking_assigned_drivers")
      .select("*")
      .eq("driver_id", driver_id)
      .eq("status", "rejected");

    if (rejectedError) throw rejectedError;

    // If there are any rejected bookings for the driver, filter them out
    const rejectedBookingIds = rejectedAssignments.map((assignment: any) => assignment.booking_id);

    // 2. Get the latest pending booking assigned to this driver, but make sure it's not rejected
    const { data: assignment, error: assignError } = await supabase
      .from("booking_assigned_drivers")
      .select("*")
      .eq("driver_id", driver_id)
      .eq("status", "pending") // Only return pending ones
      .not("booking_id", "in", `(${rejectedBookingIds.join(",")})`)// Make sure the rejected booking is not returned
      .order("pending_at", { ascending: false })
      .maybeSingle();

    if (assignError) throw assignError;

    if (!assignment) {
      return NextResponse.json({ status: 0, message: "No pending bookings found" }, { status: 200 });
    }

    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .select("*, booking_id")
      .eq("booking_id", assignment.booking_id)
      .single();

    if (bookingError) throw bookingError;

    const BookingID = bookingData?.booking_id;

    const { data: bookingLatLong, error: bookingLatLongError } = await supabase
      .from("booking_locations")
      .select("customer_latitude, customer_longitude, dropoff_lat, dropoff_lng")
      .eq("booking_id", BookingID)
      .maybeSingle();

    let distance_km = null;
    if (
      bookingLatLong?.customer_latitude &&
      bookingLatLong?.customer_longitude &&
      bookingLatLong?.dropoff_lat &&
      bookingLatLong?.dropoff_lng
    ) {
      distance_km = haversineDistance(
        bookingLatLong.customer_latitude,
        bookingLatLong.customer_longitude,
        bookingLatLong.dropoff_lat,
        bookingLatLong.dropoff_lng
      );
    }

    const { data: driverLoc, error: driverLocError } = await supabase
      .from("drivers")
      .select("latitude, longitude")
      .eq("driver_id", driver_id)
      .maybeSingle();

    let driverPickupDistance = null;
    if (
      bookingLatLong?.customer_latitude &&
      bookingLatLong?.customer_longitude &&
      driverLoc?.latitude &&
      driverLoc?.longitude
    ) {
      const custLat = parseFloat(bookingLatLong.customer_latitude);
      const custLng = parseFloat(bookingLatLong.customer_longitude);
      const driverLat = parseFloat(driverLoc.latitude);
      const driverLng = parseFloat(driverLoc.longitude);

      driverPickupDistance = haversineDistance(driverLat, driverLng, custLat, custLng);
    }

    const merged = {
      ...assignment,
      ...bookingLatLong,
      ...(bookingData || {}),
      distance_km: distance_km ? parseFloat(distance_km.toFixed(2)) : null,
      driver_pickup_distance_km: driverPickupDistance ? parseFloat(driverPickupDistance.toFixed(2)) : null,
    };

    return NextResponse.json({ status: 1, data: merged }, { status: 200 });

  } catch (error) {
    console.error("Error fetching assigned booking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
