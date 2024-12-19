import { createClient } from "../../../../../utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET(request: any) {
  const supabase = createClient();

  try {
    // Get the search parameters from the request URL
    const { searchParams } = new URL(request.url);
    const serviceCenterName = searchParams.get("service_center_name"); // Filter by service center name
    const startDate = searchParams.get("start_date"); // Start date for filtering
    const endDate = searchParams.get("end_date"); // End date for filtering

    // Fetch data from driver_invoices table
    let query = supabase
      .from("driver_invoices")
      .select(`
        service_center_id,
        driver_id,
        booking_id,
        payment_date,
        total_amount,
        is_paid
      `);

    // Apply date filter if provided
    if (startDate && endDate) {
      query = query.gte("payment_date", startDate).lte("payment_date", endDate);
    }

    const { data: invoicesData, error: invoicesError } = await query;

    if (invoicesError) {
      return NextResponse.json(
        { message: "Error fetching invoices data", error: invoicesError.message },
        { status: 500 }
      );
    }

    // Fetch data from service_centers table
    let serviceCentersQuery = supabase
      .from("service_centers")
      .select("service_center_id, name");

    // Apply filter for service center name if provided
    if (serviceCenterName) {
      serviceCentersQuery = serviceCentersQuery.ilike("name", `%${serviceCenterName}%`);
    }

    const { data: serviceCenters, error: serviceCentersError } = await serviceCentersQuery;

    if (serviceCentersError) {
      return NextResponse.json(
        { message: "Error fetching service centers", error: serviceCentersError.message },
        { status: 500 }
      );
    }

    // Fetch data from drivers table
    const { data: drivers, error: driversError } = await supabase
      .from("drivers")
      .select("driver_id, driver_name");

    if (driversError) {
      return NextResponse.json(
        { message: "Error fetching drivers", error: driversError.message },
        { status: 500 }
      );
    }
    const data = invoicesData
    .filter((invoice) =>
      serviceCenters.some(
        (sc) => sc.service_center_id === invoice.service_center_id
      )
    )
    .map((invoice) => {
      const serviceCenter = serviceCenters.find(
        (sc) => sc.service_center_id === invoice.service_center_id
      );
      const driver = drivers.find((d) => d.driver_id === invoice.driver_id);

      const formattedDate = invoice.payment_date
        ? new Date(invoice.payment_date).toISOString().split("T")[0]
        : "N/A";

    // // Combine the data and apply necessary formatting
    // const data = invoicesData.map((invoice) => {
    //   const serviceCenter = serviceCenters.find(
    //     (sc) => sc.service_center_id === invoice.service_center_id
    //   );
    //   const driver = drivers.find((d) => d.driver_id === invoice.driver_id);
    //   const formattedDate = invoice.payment_date
    //     ? new Date(invoice.payment_date).toISOString().split("T")[0]
    //     : "N/A";

      return {
        service_center_name: serviceCenter ? serviceCenter.name : "N/A",
        driver_name: driver ? driver.driver_name : "N/A",
        booking_id: invoice.booking_id,
        payment_date: formattedDate,
        total_amount: invoice.total_amount,
        is_paid: invoice.is_paid,
      };
    });

    // Return the combined and filtered data
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching data", error: error.message },
      { status: 500 }
    );
  }
}
