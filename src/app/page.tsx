
"use client";

import { useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { useRouter } from "next/navigation";


export default function Home(){
  const router = useRouter();
  useEffect(() => {
    const checkUser = async () => {
      const supabase = await createClient();
      const {data,error} = await supabase.auth.getUser();

      

      if (error || data?.user){
        router.push("/login")
      }
      else {
        router.push("/dashboard")
      }
    }
    checkUser();
  },[router])

  return null;
}