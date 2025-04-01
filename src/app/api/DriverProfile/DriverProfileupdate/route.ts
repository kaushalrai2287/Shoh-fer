// import { supabase } from '../../lib/supabase';
import { createClient } from '../../../../../utils/supabase/client';
import { NextResponse } from 'next/server';

export async function POST(req:Request) {
    try {

        const body = await req.json();
        const { driver_id } = body;
        const supabase = await createClient();
        // Fetch years of experience
        const { data: drivers, error: driversError } = await supabase
            .from('drivers')
            .select('*')
            .eq('driver_id', driver_id); 
       

        // Fetch spoken languages
   

        // Return formatted response
        return NextResponse.json({
            status: '1',
            message: 'Data fetched successfully',
            data: {
                drivers
           
              
            }
        });
    } catch (error:any) {
        console.error('Error fetching professional info:', error.message);
        return NextResponse.json({ status: '0', message: error.message });
    }
}
