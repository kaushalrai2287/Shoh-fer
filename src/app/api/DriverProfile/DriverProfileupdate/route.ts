import { createClient } from '../../../../../utils/supabase/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { driver_id, phone_number, email, address, emergency_contact_no } = body;
        
        if (!driver_id) {
            return NextResponse.json({ status: '0', message: 'Driver ID is required' });
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('drivers')
            .update({ phone_number, email, address, emergency_contact_no })
            .eq('driver_id', driver_id)
            .select('*');

        if (error) {
            throw error;
        }

        return NextResponse.json({
            status: '1',
            message: 'Profile updated successfully',
            data
        });
    } catch (error: any) {
        console.error('Error updating driver profile:', error.message);
        return NextResponse.json({ status: '0', message: error.message });
    }
}