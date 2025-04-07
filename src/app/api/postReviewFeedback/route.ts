import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/client";

const supabase = createClient();

export async function POST(req:Request) {
    try {
        const { booking_id, rating, comment } = await req.json();

       
        if (!Number.isInteger(booking_id)) {
            return NextResponse.json(
                { status: "error", message: "Invalid booking_id. Must be an integer." },
                { status: 400 }
            );
        }

     
        const { data: booking, error: bookingError } = await supabase
            .from("bookings")
            .select("status")
            .eq("booking_id", booking_id)
            .single();

        if (bookingError || !booking || booking.status !== "completed") {
            return NextResponse.json(
                { status: "error", message: "Review can only be given for completed bookings." },
                { status: 400 }
            );
        }

      
        const { data, error } = await supabase.from("review_feedback").insert([
            { booking_id, rating, comment }
        ]);

        if (error) {
            return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
        }

        return NextResponse.json({ status: "success", message: "Review submitted successfully!", data });
    } catch (error) {
        return NextResponse.json({ status: "error", message: "Invalid request" }, { status: 400 });
    }
}
