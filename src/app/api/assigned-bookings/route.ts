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
import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/client";

const supabase = createClient();

export async function POST(req: Request) {
  try {
    const { driver_id } = await req.json();

    if (!driver_id) {
      return NextResponse.json({ error: "Driver ID is required" }, { status: 400 });
    }

    // 1. Get all assigned bookings for this driver except rejected ones
    const { data: assignments, error: assignError } = await supabase
      .from("booking_assigned_drivers")
      .select("*")
      .eq("driver_id", driver_id)
      .not("status", "eq", "rejected");

    if (assignError) throw assignError;

    if (!assignments || assignments.length === 0) {
      return NextResponse.json({ status: 0, message: "No bookings found" }, { status: 200 });
    }

    // 2. Take the first assignment only
    const assignment = assignments[0];

    // 3. Fetch the corresponding booking
    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_id", assignment.booking_id)
      .single();

    if (bookingError) throw bookingError;

    // 4. Merge the assignment with booking data
    const merged = {
      ...assignment,
      ...(bookingData || {})
    };

    return NextResponse.json({ status: 1, data: merged }, { status: 200 });

  } catch (error) {
    console.error("Error fetching assigned booking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
