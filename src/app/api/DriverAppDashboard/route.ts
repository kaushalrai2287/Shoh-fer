
import { NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/client';
import { haversineDistance } from '../../../../utils/distance';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { driver_id } = body;

    if (!driver_id) {
      return NextResponse.json(
        { message: 'Driver ID is required', status: 'error' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Fetch driver details from the database
    const { data: driverData, error: driverError } = await supabase
      .from('drivers')
      .select('isadminverified, kyc_status, police_verification_status,is_online')
      .eq('driver_id', driver_id)
      .single();

    if (driverError || !driverData) {
      console.error('Error fetching driver details:', driverError);
      return NextResponse.json(
        { message: 'Driver not found', status: 'error' },
        { status: 404 }
      );
    }

   
    const formatStatus = (status: string, type: string) => {
      let message = '';
      switch (status) {
        case 'approved':
          message = `${type} approved`;
          if (type === 'KYC') {
            message = 'KYC verification is successfully completed, and the admin has approved the physical documentation.';
          }
          break;
        case 'pending':
          message = `${type} pending`;
          if (type === 'KYC') {
            message = 'KYC document verification must be completed within 3 days, and the physical documentation is awaiting admin approval.';
          }
          if (type === 'Police verification' && driverData.police_verification_status === 'pending') {
            message = 'Police verification is still pending, even after seven days of visiting the Chofor office.';
          }
          break;
        case 'rejected':
          message = `${type} rejected`;
          break;
        default:
          message = `${type} status unknown`;
      }
      return { message, status };
    };

    const isPending =
      driverData.isadminverified === 'pending' ||
      driverData.kyc_status === 'pending' ||
      driverData.police_verification_status === 'pending';

    if (isPending) {
      return NextResponse.json(
        {
          message: 'Driver details fetched successfully',
          status: '1',
          data: {
           
            isAdminVerified: formatStatus(driverData.isadminverified, 'Admin verification'),
            kyc: formatStatus(driverData.kyc_status, 'KYC'),
            policeverification: formatStatus(driverData.police_verification_status, 'Police verification'),
            bookings: []
          },
        },
        { status: 200 }
      );
    }

const today = new Date().toISOString().split('T')[0];
const { data: assignedBookings, error: assignedError } = await supabase
  .from('booking_assigned_drivers')
  .select('booking_id')
  .eq('driver_id', driver_id);

if (assignedError) {
  console.error('Error fetching assigned bookings:', assignedError);
  return NextResponse.json(
    { message: 'Error fetching assigned bookings', status: 'error' },
    { status: 500 }
  );
}


const bookingIds = assignedBookings.map(b => b.booking_id);

// if (bookingIds.length === 0) {
//   return NextResponse.json(
//     { message: 'No bookings found for driver', status: 'success', data: [] },
//     { status: 200 }
//   );
// }

if (bookingIds.length === 0) {
  return NextResponse.json(
    {
      message: 'No bookings found for driver',
      status: '1',
      data: {
        DriverOnlineStatus: driverData.is_online,
        isAdminVerified: formatStatus(driverData.isadminverified, 'Admin verification'),
        kyc: formatStatus(driverData.kyc_status, 'KYC'),
        policeverification: formatStatus(driverData.police_verification_status, 'Police verification'),
        bookings: [],
      },
    },
    { status: 200 }
  );
}


const { data: bookings, error: bookingError } = await supabase
  .from('bookings')
  .select('*, vehicles(license_plate_no, brand_id, model_id)')
  .in('booking_id', bookingIds)
  .gte('created_at', `${today}T00:00:00.000Z`)
  .lt('created_at', `${today}T23:59:59.999Z`)
  // .order('created_at', { ascending: false });

if (bookingError) {
  console.error('Error fetching booking details:', bookingError);
  return NextResponse.json(
    { message: 'Error fetching booking details', status: 'error' },
    { status: 500 }
  );
}
type BookingStatus = 'active' | 'accepted' | string;

const priority: Record<BookingStatus, number> = {
  active: 1,
  accepted: 2,
  // all others default to 99 when accessed
};

bookings.sort((a, b) => {
  const aPriority = priority[a.status as BookingStatus] ?? 99;
  const bPriority = priority[b.status as BookingStatus] ?? 99;
  return aPriority - bPriority || new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
});
// Optional: If needed for next steps
const filteredBookingIds = bookings.map(booking => booking.booking_id);

const { data: bookingLocation, error: bookingLocationError } = await supabase
  .from('booking_locations')
  .select('customer_latitude, booking_id, customer_longitude, dropoff_lat, dropoff_lng')
  .in('booking_id', filteredBookingIds);

if (bookingLocationError) {
  console.error('Error fetching booking Location:', bookingLocationError);
  return NextResponse.json(
    { message: 'Error fetching booking Location', status: 'error' },
    { status: 500 }
  );
}


// Enrich bookings with brand and model names
const enrichedBookings = await Promise.all(
  bookings.map(async (booking) => {
    const vehicle = booking.vehicles;

    let brandName = null;
    let modelName = null;

    if (vehicle?.brand_id) {
      const { data: brandData } = await supabase
        .from('brands')
        .select('name')
        .eq('id', vehicle.brand_id)
        .single();

      brandName = brandData?.name || null;
      
    }

    if (vehicle?.model_id) {
      const { data: modelData } = await supabase
        .from('models')
        .select('name')
        .eq('id', vehicle.model_id)
        .eq('brand_id', vehicle.brand_id) 
        .single();

      modelName = modelData?.name || null;
    }


const location = bookingLocation.find(loc => loc.booking_id === booking.booking_id);
let distance_km = null;
if (
  location?.customer_latitude &&
  location?.customer_longitude &&
  location?.dropoff_lat &&
  location?.dropoff_lng
) {
  distance_km = haversineDistance(
    location.customer_latitude,
    location.customer_longitude,
    location.dropoff_lat,
    location.dropoff_lng
  );
}

return {
  ...booking,
  customer_location: {
    pickup: {
      lat: location?.customer_latitude || null,
      lng: location?.customer_longitude || null,
    },
    dropoff: {
      lat: location?.dropoff_lat || null,
      lng: location?.dropoff_lng || null,
    },
    distance_km: distance_km ? parseFloat(distance_km.toFixed(2)) : null
  },
  vehicles: {
    ...vehicle,
    brand_name: brandName,
    model_name: modelName,
  }
};

  })
);

return NextResponse.json(
  {
    message: 'Driver details and bookings fetched successfully',
    status: '1',
    data: {
      DriverOnlineStatus: driverData.is_online,
      isAdminVerified: formatStatus(driverData.isadminverified, 'Admin verification'),
      kyc: formatStatus(driverData.kyc_status, 'KYC'),
      policeverification: formatStatus(driverData.police_verification_status, 'Police verification'),
      bookings: enrichedBookings,
    },
  },
  { status: 200 }
);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', status: 'error' },
      { status: 500 }
    );
  }
}
