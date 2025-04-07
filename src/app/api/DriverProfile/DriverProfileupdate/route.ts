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
        const { driver_id, new_phone_number, new_email } = body;

        if (!driver_id) {
            return NextResponse.json({ status: '0', message: 'Missing driver_id' });
        }

        const isEmailProvided = !!new_email;
        const isPhoneProvided = !!new_phone_number;

        // Enforce one change at a time
        if ((isEmailProvided && isPhoneProvided) || (!isEmailProvided && !isPhoneProvided)) {
            return NextResponse.json({
                status: '0',
                message: 'Provide either new_email or new_phone_number, not both',
            });
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

        let insertPayload;

        if (isPhoneProvided) {
            if (new_phone_number === driverData.phone_number) {
                return NextResponse.json({
                    status: '0',
                    message: 'Phone number is the same as current',
                });
            }

            insertPayload = {
                driver_id,
                type: 'phone',
                previous_value: driverData.phone_number,
                new_value: new_phone_number,
                otp,
                created_at: new Date(),
            };
        } else {
            if (new_email === driverData.email) {
                return NextResponse.json({
                    status: '0',
                    message: 'Email is the same as current',
                });
            }

            insertPayload = {
                driver_id,
                type: 'email',
                previous_value: driverData.email,
                new_value: new_email,
                otp,
                created_at: new Date(),
            };
        }

        const { error: insertError } = await supabase
            .from('driver_profile_updates')
            .insert([insertPayload]);

        if (insertError) {
            throw insertError;
        }

        return NextResponse.json({ status: '1', message: 'OTP sent successfully', otp });
    } catch (error: any) {
        console.error('Error generating OTP:', error.message);
        return NextResponse.json({ status: '0', message: error.message });
    }
}

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
}
