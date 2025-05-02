import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";
import { createClient } from "../../../../../utils/supabase/client";
import { encrypt } from "../../../../../utils/functions/encryptBankDetails";
import { decrypt } from "../../../../../utils/functions/encryptBankDetails";

const supabase = createClient();

export async function POST(req:Request) {
    try {
        const { driver_id, account_no, ifsc_code, branch_name, bank_name } = await req.json();

        // Validate input
        if (!Number.isInteger(driver_id) || !account_no || !ifsc_code || !branch_name || !bank_name) {  
            return NextResponse.json(
                { status: "error", message: "All fields are required and driver_id must be an integer." },
                { status: 400 } 
            );
        }
        const encryptedAccountNo = encrypt(account_no);
// const decryptedAccountNo = decrypt(encryptedAccountNo);
// console.log("Decrypted Account No:", decryptedAccountNo); 
        // Check if driver exists
        const { data: driver, error: driverError } = await supabase
            .from("drivers")
            .select("driver_id")
            .eq("driver_id", driver_id)
            .single();

        if (driverError || !driver) {
            return NextResponse.json({ status: "error", message: "Driver not found." }, { status: 404 });
        }

        // Insert bank details
        const { data, error } = await supabase
            .from("driver_bank_details")
            .insert([{ driver_id, account_no:encryptedAccountNo, ifsc_code, branch_name, bank_name }]);

        if (error) {
            return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
        }

        return NextResponse.json({
            status: "success",
            message: "Bank details added successfully",
            // data
        });
    } catch (error) {
        return NextResponse.json({ status: "error", message: "Invalid request" }, { status: 400 });
    }
}
