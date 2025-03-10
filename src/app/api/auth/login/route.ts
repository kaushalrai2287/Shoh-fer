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

//         const { data, error } = await supabase.auth.signInWithPassword({ email, password });

//         if (error) {
//             return NextResponse.json({ error: error.message }, { status: 400 });
//         }

//         return NextResponse.json(
//             { message: "Login Successfull.", user: data.user },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Signup error:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
// import { NextResponse } from "next/server";
// import { createClient } from "../../../../../utils/supabase/server";

// export async function POST(req: Request) {
//     try {
//         const supabase = await createClient();
//         const body = await req.json();
//         const { phone_number, otp } = body;

//         if (!phone_number || !otp) {
//             return NextResponse.json(
//                 { error: "Mobile number and OTP are required" },
//                 { status: 400 }
//             );
//         }

        
//         const { data: driver, error: fetchError } = await supabase
//             .from("drivers")
//             .select("driver_id, otp")
//             .eq("phone_number", phone_number)
//             .single();

//         if (fetchError) {
//             return NextResponse.json(
//                 { error: "Driver not found" },
//                 { status: 404 }
//             );
//         }

       
//         if (driver.otp !== otp) {
//             return NextResponse.json(
//                 { error: "Invalid OTP" },
//                 { status: 400 }
//             );
//         }


//         return NextResponse.json(
//             { message: "Login Successful", driver_id: driver.driver_id },
//             { status: 200 }
//         );

//     } catch (error) {
//         return NextResponse.json(
//             { error: "Internal Server Error" },
//             { status: 500 }
//         );
//     }
// }
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
// import { NextResponse } from "next/server";
// import { createClient } from "../../../../../utils/supabase/server";

// export async function POST(req: Request) {
//     try {
//         const supabase = await createClient();
//         const body = await req.json();
//         const { phone_number,device_id } = body;

//         if (!phone_number) {
//             return NextResponse.json({ error: "Mobile number required" }, { status: 200 });
//         }

//         const otp = "1234"; 

 
//         const { data: existingDriver, error: fetchError } = await supabase
//             .from("drivers")
//             .select("driver_id")
//             .eq("phone_number", phone_number)
//             .single();

//         if (fetchError && fetchError.code !== "PGRST116") { 
//             // Ignore "PGRST116: no rows found" error
//             return NextResponse.json({ error: fetchError.message }, { status: 400 });
//         }

//         if (existingDriver) {
         
//             const { error: updateError } = await supabase
//                 .from("drivers")
//                 .update({ otp })
//                 .eq("phone_number", phone_number);

//             if (updateError) {
//                 return NextResponse.json({ error: updateError.message }, { status: 400 });
//             }
//         } else {
            
        
           
//                 return NextResponse.json({ status:0,message: "Phone not registerd!" }, { status: 200 });
            
//         }

//         return NextResponse.json({ status:1,message: "OTP sent successfully!",otp }, { status: 200 }); // Remove OTP in production
//     } catch (error) {
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { phone_number, device_id } = body;

        if (!phone_number) {
            return NextResponse.json({ message: "Mobile number required" }, { status: 200 });
        }

        if (!device_id) {
            return NextResponse.json({ message: "Device ID required" }, { status: 200 });
        }

        const otp = "1234"; // For testing only

        // Check if the phone number already exists
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
            // Update existing driver with OTP and device_id
            const { error: updateError } = await supabase
                .from("drivers")
                .update({ otp, device_id })
                .eq("phone_number", phone_number);

            if (updateError) {
                return NextResponse.json({ error: updateError.message }, { status: 400 });
            }
        } else {
            return NextResponse.json({ status: 0, message: "Phone not registered!" }, { status: 200 });
        }

        return NextResponse.json({ status: 1, message: "OTP sent successfully!", otp }, { status: 200 });
    } catch (error) {
        // console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
