import { createClient } from "../../../../../utils/supabase/client";
import { NextResponse } from "next/server";


export async function GET(request: any) {
  const supabase = createClient();

  try {

    const { data: feedbackData, error: feedbackError } = await supabase
      .from("feedback_and_ratings")
      .select(`
        service_center_id,
        driver_id,
        booking_id,
        feedback,
        rating
      `);

    if (feedbackError) {
      return NextResponse.json(
        { message: "Error fetching feedback data", error: feedbackError.message },
        { status: 500 }
      );
    }

 
    const { data: serviceCenters, error: serviceCentersError } = await supabase
      .from("service_centers")
      .select("service_center_id, name");

    if (serviceCentersError) {
      return NextResponse.json(
        { message: "Error fetching service centers", error: serviceCentersError.message },
        { status: 500 }
      );
    }

   
    const { data: drivers, error: driversError } = await supabase
      .from("drivers")
      .select("driver_id, driver_name");

    if (driversError) {
      return NextResponse.json(
        { message: "Error fetching drivers", error: driversError.message },
        { status: 500 }
      );
    }

    const data = feedbackData.map((feedback) => {
      const serviceCenter = serviceCenters.find(
        (sc) => sc.service_center_id === feedback.service_center_id
      );
      const driver = drivers.find((d) => d.driver_id === feedback.driver_id);

      return {
        ...feedback,
        service_center_name: serviceCenter ? serviceCenter.name : "N/A",
        driver_name: driver ? driver.driver_name : "N/A",
      };
    });

  
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching data", error: error.message },
      { status: 500 }
    );
  }
}
