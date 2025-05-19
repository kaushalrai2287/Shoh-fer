import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("PROJECT_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE")!;



// Create Supabase client with service role key for admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (_req) => {
  try {
    // Get current timestamp minus 45 seconds
    const thresholdDate = new Date(Date.now() - 45 * 1000).toISOString();

    // Find pending bookings older than 45 seconds
    const { data: pendingBookings, error } = await supabase
      .from("booking_assigned_driver")
      .select("*")
      .eq("status", "pending")
      .lt("pending_at", thresholdDate);  

    if (error) {
      console.error("Error fetching pending bookings:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    if (!pendingBookings || pendingBookings.length === 0) {
      return new Response(JSON.stringify({ message: "No pending bookings older than 45 seconds." }), { status: 200 });
    }

    // Update all those bookings to 'rejected'
    const bookingIds = pendingBookings.map((b) => b.id);

    const { error: updateError } = await supabase
      .from("booking_assigned_driver")
      .update({ status: "rejected" })
      .in("id", bookingIds);

    if (updateError) {
      console.error("Error updating bookings to rejected:", updateError);
      return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
    }

    // TODO: Call your "assign driver" function logic here for each rejected booking
    // Example: for each bookingId => reassignDriver(bookingId);

    return new Response(JSON.stringify({ message: "Pending bookings rejected and reassignment triggered.", count: bookingIds.length }), { status: 200 });

  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Unexpected error occurred." }), { status: 500 });
  }
});
