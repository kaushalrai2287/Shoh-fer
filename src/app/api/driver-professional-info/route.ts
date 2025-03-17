// import { supabase } from '../../lib/supabase';
import { createClient } from '../../../../utils/supabase/client';
import { NextResponse } from 'next/server';

export async function GET(req:Request) {
    try {
        const supabase = await createClient();
        // Fetch years of experience
        const { data: experience, error: experienceError } = await supabase
            .from('driver_experience')
            .select('*');

        if (experienceError) throw experienceError;

        // Fetch vehicle types
        const { data: vehicleTypes, error: vehicleError } = await supabase
            .from('driver_vehicle_type')
            .select('*');

        if (vehicleError) throw vehicleError;

        // Fetch brands
        const { data: brands, error: brandError } = await supabase
            .from('brands')
            .select('id, name');

        if (brandError) throw brandError;

        // Fetch driving types
        const { data: driving, error: drivingError } = await supabase
            .from('driver_transmission_type')
            .select('*');

        if (drivingError) throw drivingError;

        // Fetch license categories
        const { data: licenseCategories, error: licenseCategoryError } = await supabase
            .from('driver_license_category')
            .select('*');

        if (licenseCategoryError) throw licenseCategoryError;

        // Fetch license expiry dates
       

        // Fetch spoken languages
   

        // Return formatted response
        return NextResponse.json({
            status: '1',
            message: 'Data fetched successfully',
            data: {
                experience,
                vehicleTypes,
                brands,
                driving,
                licenseCategories,
              
            }
        });
    } catch (error:any) {
        console.error('Error fetching professional info:', error.message);
        return NextResponse.json({ status: '0', message: error.message });
    }
}
