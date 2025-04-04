// import { createClient } from '../../../../../utils/supabase/client';
// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//     try {
//         const body = await req.json();
//         const { driver_id, phone_number, email, address, emergency_contact_no } = body;
        
//         if (!driver_id) {
//             return NextResponse.json({ status: '0', message: 'Driver ID is required' });
//         }

//         const supabase = await createClient();

//         const { data, error } = await supabase
//             .from('drivers')
//             .update({ phone_number, email, address, emergency_contact_no })
//             .eq('driver_id', driver_id)
//             .select('*');

//         if (error) {
//             throw error;
//         }

//         return NextResponse.json({
//             status: '1',
//             message: 'Profile updated successfully',
//             data
//         });
//     } catch (error: any) {
//         console.error('Error updating driver profile:', error.message);
//         return NextResponse.json({ status: '0', message: error.message });
//     }
// }
import { createClient } from '../../../../../utils/supabase/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { driver_id, new_phone_number, new_email,emergency_contact_no,address } = body;

        if (!driver_id || !new_phone_number || !new_email) {
            return NextResponse.json({ status: '0', message: 'Missing required fields' });
        }

        const supabase = await createClient();
        const otp = generateOTP();

        
        const { data: driverData, error: driverError } = await supabase
            .from('drivers')
            .select('phone_number, email')
            .eq('driver_id', driver_id)
            .single();

        if (driverError || !driverData) {
            return NextResponse.json({ status: '0', message: 'Driver not found' });
        }

       
        const { data, error } = await supabase
            .from('driver_profile_updates')
            .insert([
                {
                    driver_id,
                    previous_phone_number: driverData.phone_number,
                    new_phone_number,
                    previous_email: driverData.email,
                    new_email,
                    otp,
                    created_at: new Date(),
                },
            ]);

        if (error) {
            throw error;
        }

        return NextResponse.json({ status: '1', message: 'OTP sent successfully', otp });
    } catch (error: any) {
        console.error('Error generating OTP:', error.message);
        return NextResponse.json({ status: '0', message: error.message });
    }
}


function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}
