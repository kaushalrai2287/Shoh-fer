import { createClient } from '../../../../../utils/supabase/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { driver_id, otp, type } = body;

        if (!driver_id || !otp || !type) {
            return NextResponse.json({ status: '0', message: 'Missing required fields' });
        }

        const supabase = await createClient();

        // Step 1: Fetch OTP record
        const { data: updateRecord, error } = await supabase
            .from('driver_profile_updates')
            .select('*')
            .eq('driver_id', driver_id)
            .eq('otp', otp)
            .eq('type', type)
            .eq('is_verified', false)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !updateRecord) {
            return NextResponse.json({ status: '0', message: 'Invalid OTP or already verified' });
        }

        // Step 2: Mark OTP as verified
        const { error: updateOtpError } = await supabase
            .from('driver_profile_updates')
            .update({ is_verified: true })
            .eq('id', updateRecord.id);

        if (updateOtpError) {
            throw updateOtpError;
        }

        // Step 3: Update driver's phone or email
        const updateField =
            type === 'phone' ? { phone_number: updateRecord.new_value } :
            type === 'email' ? { email: updateRecord.new_value } : null;

        if (!updateField) {
            return NextResponse.json({ status: '0', message: 'Invalid type' });
        }

        const { error: driverUpdateError } = await supabase
            .from('drivers')
            .update(updateField)
            .eq('driver_id', driver_id);

        if (driverUpdateError) {
            throw driverUpdateError;
        }

        return NextResponse.json({ status: '1', message: 'OTP verified and profile updated successfully' });
    } catch (error: any) {
        console.error('OTP verification error:', error.message);
        return NextResponse.json({ status: '0', message: error.message });
    }
}
