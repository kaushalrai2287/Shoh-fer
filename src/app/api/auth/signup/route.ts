// // import { NextResponse } from "next/server";
// // import { createClient } from "../../../../../utils/supabase/server";


// // export async function POST(req:Request) {
// //     try {
// //         const supabase = await createClient();
// //         // console.log("Incoming request:", req);

// //         const body = await req.json();
// //         // console.log("Parsed body:", body);
        
// //         const { email, password } = body;

// //         if (!email || !password) {
// //             return NextResponse.json(
// //                 { error: "Email and password are required" },
// //                 { status: 400 }
// //             );
// //         }

// //         const { data, error } = await supabase.auth.signUp({ email, password });

// //         if (error) {
// //             return NextResponse.json({ error: error.message }, { status: 400 });
// //         }

// //         return NextResponse.json(
// //             { message: "Signup successful! Check your email.", user: data.user },
// //             { status: 200 }
// //         );
// //     } catch (error) {
// //         console.error("Signup error:", error);
// //         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// //     }
// // }
// import { NextResponse } from "next/server";
// import { createClient } from "../../../../../utils/supabase/server";


// export async function POST(req:Request) {
//     try {
//         const supabase = await createClient();
//         // console.log("Incoming request:", req);

//         const body = await req.json();
//         // console.log("Parsed body:", body);
        
//         const { email, password } = body;

//         if (!email || !password) {
//             return NextResponse.json(
//                 { error: "Email and password are required" },
//                 { status: 400 }
//             );
//         }

//         const { data, error } = await supabase.auth.signUp({ email, password });

//         if (error) {
//             return NextResponse.json({ error: error.message }, { status: 400 });
//         }

//         return NextResponse.json(
//             { message: "Signup successful! Check your email.", user: data.user },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Signup error:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { phone_number } = body;

        if (!phone_number) {
            return NextResponse.json({ error: "Mobile number required" }, { status: 400 });
        }

        const otp = "1234";     

 
        const { data: existingDriver, error: fetchError } = await supabase
            .from("drivers")
            .select("driver_id")
            .eq("phone_number", phone_number)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") { 
            // Ignore "PGRST116: no rows found" error
            return NextResponse.json({ error: fetchError.message }, { status: 400 });
        }

        if (existingDriver) {
         
            const { error: updateError } = await supabase
                .from("drivers")
                .update({ otp })
                .eq("phone_number", phone_number);

            if (updateError) {
                return NextResponse.json({ error: updateError.message }, { status: 400 });
            }
        } else {
            
            const { error: insertError } = await supabase
                .from("drivers")
                .insert([{ phone_number, otp }]);

            if (insertError) {
                return NextResponse.json({ error: insertError.message }, { status: 400 });
            }
        }

        return NextResponse.json({ message: "OTP sent successfully!", otp }, { status: 200 }); // Remove OTP in production
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
