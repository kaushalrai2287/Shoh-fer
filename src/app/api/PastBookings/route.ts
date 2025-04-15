// import { NextResponse } from 'next/server';
// import { createClient } from '../../../../utils/supabase/client';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { driver_id, status, start_date, end_date, page = 1, limit = 10 } = body;

//     if (!driver_id) {
//       return NextResponse.json(
//         { message: 'Driver ID is required', status: 'error' },
//         { status: 400 }
//       );
//     }

//     const supabase = createClient();
//     let query = supabase.from('bookings').select('*', { count: 'exact' }).eq('driver_id', driver_id);

//     // Filter by status if provided
//     if (status) {
//       query = query.eq('status', status);
//     }

//     // Filter by date range if provided
//     if (start_date && end_date) {
//       query = query.gte('created_at', `${start_date}T00:00:00.000Z`).lt('created_at', `${end_date}T23:59:59.999Z`);
//     }

//     // Pagination
//     const offset = (page - 1) * limit;
//     query = query.range(offset, offset + limit - 1);

//     const { data: bookings, error, count } = await query;

//     if (error) {
//       console.error('Error fetching bookings:', error);
//       return NextResponse.json(
//         { message: 'Error fetching bookings', status: 'error' },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       {
//         message: 'Bookings fetched successfully',
//         status: '1',
//         data: {
//           bookings,
//           pagination: {
//             total: count || 0,
//             page,
//             limit,
//             total_pages: Math.ceil((count || 0) / limit),
//           },
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json(
//       { message: 'Internal Server Error', status: 'error' },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { driver_id, status, start_date, end_date, page = 1, limit = 10 } = body;

    if (!driver_id) {
      return NextResponse.json(
        { message: 'Driver ID is required', status: 'error' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const offset = (page - 1) * limit;

    // Build initial query
    let query = supabase
      .from('bookings')
      .select(`
        *,
        vehicles:vehicle_id (
          license_plate_no,
          brand:brand_id ( name ),
          model:model_id ( name )
        )
      `, { count: 'exact' })
      .eq('driver_id', driver_id);

    if (status) {
      query = query.eq('status', status);
    }

    if (start_date && end_date) {
      query = query
        .gte('created_at', `${start_date}T00:00:00.000Z`)
        .lt('created_at', `${end_date}T23:59:59.999Z`);
    }

    query = query.range(offset, offset + limit - 1);

    const { data: bookings, error, count } = await query;

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json(
        { message: 'Error fetching bookings', status: 'error' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Bookings fetched successfully',
        status: '1',
        data: {
          bookings,
          pagination: {
            total: count || 0,
            page,
            limit,
            total_pages: Math.ceil((count || 0) / limit),
          },
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
