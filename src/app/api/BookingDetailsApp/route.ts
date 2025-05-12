import { NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { booking_id } = body;

    if (!booking_id) {
      return NextResponse.json(
        { message: 'Booking ID is required', status: 'error' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // 1. Fetch booking details including vehicle
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        vehicles:vehicle_id (
          license_plate_no,
          brand:brand_id ( name ),
          model:model_id ( name )
        )
      `)
      .eq("booking_id", booking_id)
      .maybeSingle();

    if (bookingError || !bookingData) {
      console.error('Error fetching booking details:', bookingError);
      return NextResponse.json(
        { message: 'Booking not found', status: 'error' },
        { status: 404 }
      );
    }

    // 2. Separate vehicle details
    const { vehicles, ...bookingDetails } = bookingData;

    const vehicle_details = {
      license_plate_no: vehicles?.license_plate_no || null,
      brand_name: vehicles?.brand?.name || null,
      model_name: vehicles?.model?.name || null,
    };

    // 3. Fetch coordinates from booking_locations table
    const { data: locationData, error: locationError } = await supabase
      .from("booking_locations")
      .select("customer_latitude, customer_longitude, dropoff_lat, dropoff_lng")
      .eq("booking_id", booking_id)
      .maybeSingle();

    if (locationError) {
      console.error("Error fetching location details:", locationError);
      return NextResponse.json(
        { message: 'Error fetching location data', status: 'error' },
        { status: 500 }
      );
    }
        // 4. Check feedback_complaints table for the booking
        const { data: feedbackData, error: feedbackError } = await supabase
        .from("feedback_complaints")
        .select("id") // selecting a single field is enough to check existence
        .eq("booking_id", booking_id)
        .limit(1); // only need to check if at least one row exists
  
      const hasFeedbackOrComplaint = feedbackData && feedbackData.length > 0 ? 'yes' : 'no';
  

    const response = {
      message: 'Booking details fetched successfully',
      status: '1',
      data: {
        ...bookingDetails,
        // actual_booking_id: bookingDetails.actual_booking_id || null, // explicitly included
        vehicle_details,
        ...locationData, // coordinates directly merged in data
        has_complaint: hasFeedbackOrComplaint,
      },
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', status: 'error' },
      { status: 500 }
    );
  }
}
