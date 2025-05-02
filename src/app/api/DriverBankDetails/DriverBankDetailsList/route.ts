import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";
import { createClient } from "../../../../../utils/supabase/client";
import { decrypt } from "../../../../../utils/functions/encryptBankDetails";

const supabase = createClient();

export async function POST(req:Request) {
    try {
        const { driver_id } = await req.json();

        
        if (!Number.isInteger(driver_id)) {
            return NextResponse.json(
                { status: "error", message: "Invalid driver_id. Must be an integer." },
                { status: 400 }
            );
        }

       
        const { data, error } = await supabase
            .from("driver_bank_details")
            .select("account_no, ifsc_code, branch_name, bank_name")
            .eq("driver_id", driver_id)
            .single();
            const decryptedAccountNo = decrypt(data?.account_no || '');
            // console.log("Decrypted Account No:", decryptedAccountNo); 
        if (error || !data) {
            return NextResponse.json({ status: "error", message: "Bank details not found." }, { status: 404 });
        }

        return NextResponse.json({
            status: "success",
            message: "Bank details retrieved successfully",
            ...data,
            account_no: decryptedAccountNo
        });
    } catch (error) {
        return NextResponse.json({ status: "error", message: "Invalid request" }, { status: 400 });
    }
}
