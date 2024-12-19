"use client";

import React, { useEffect, useState } from "react";
import { FieldError, useForm, Controller } from "react-hook-form";
import Select from "react-select"; // Correct import
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from '../../../../components/Header';
import Sidemenu from "../../../../components/Sidemenu";
import { createClient } from "../../../../utils/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Role {
    role_id: string;
    role_name: string;
}

const formSchema = z.object({
    P_name: z
        .string()
        .min(1, "Role Name is required")
        .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters"),
        email: z
        .string()
        .email("Invalid email format") // Validates email format
        .min(1, "Email is required"), // Ensure email is not empty
        roll_name: z
        .string()
        .min(1, "Role Name is required"), // 
    password: z
    .string()
    .min(6, "Password must be at least 6 characters long") // Password minimum length
    .min(1, "Password is required"), // Ensure password is not empty
});

type FormValues = z.infer<typeof formSchema>;

const SystemSetting = () => {
    const [isToggled, setIsToggled] = useState(false); 
    const [roles, setRoles] = useState<Role[]>([]); 
    const [error, setError] = useState<string | null>(null); 
    const router =useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const toggleClass = () => {
        setIsToggled(!isToggled); 
    };


    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('/api/roles/getrolls'); 
                if (!response.ok) {
                    throw new Error('Failed to fetch roles');
                }

                const { roles } = await response.json();
                setRoles(roles);
         
            } catch (err) {
                setError('Failed to fetch roles');
            }
        };

        fetchRoles();
    }, []); 
  
    const onSubmit = async (data: FormValues) => {
        const supabase = createClient();
        
    
        try {
            const response = await fetch('/api/emailcheck', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: data.email }),
              });
              
              const emailCheck = await response.json();
              console.log("Email check response:", emailCheck);
              
             
              console.log("Email check response JSON:", emailCheck);
              if (!emailCheck.success) {
                toast.error(emailCheck.message);  // Show error toast if email exists
                return;
              }
          
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
            });
            // console.log(authData);
    
            if (authError) {
                toast.error("Error creating user: " + authError.message);
                return;
            }

    
         
            const { data: userData, error: userError } = await supabase
                .from("users") // Your custom table name
                .insert([
                    {
                        name: data.P_name, 
                        email: data.email, 
                       
                        auth_id: authData.user?.id, 
                    },
                ])
                .select("user_id") 
                .single();
    
            if (userError) {
                toast.error("Error inserting into custom users table: " + userError.message);
                return;
            }

                         const userId = userData.user_id; 
                         console.log(userId);

                        const { error: roleError } = await supabase.from("user_roles").insert([
                        {
                            user_id: userId,
                            role_id: data.roll_name,
                        },
                        ]);
                    console.log(data.roll_name)
                        if (roleError) {
                        toast.error("Error assigning role to user: " + roleError.message);
                        return;
                        }

            // console.log(data);
    
            // Success
             toast.success("User registered successfully!");
            reset();
        } catch (err) {
            toast.error("Something went wrong while registering.");
        }
    };
    const handleClose = (event: { preventDefault: () => void }) => {
        
        event.preventDefault(); // Prevent default form behavior
        router.push("/rolls-permission/list"); // Navigate to the desired page
      };
    

    return (
        <main className="add_notification_service_center_main">
            <Header />
            <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
                <div className="inner_left">
                    <Sidemenu onToggle={toggleClass} />
                </div>
                <div className="inner_right">
                    <div className="add_service_formbox checkbox_formbox">
                    <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="service_form_heading">
                                Assign Permissions
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="name">Name<span> * </span></label>
                                <input className="form-control" {...register('P_name')}type="text" id="name" />
                                {errors.P_name && (
                                    <p className="erro_message">{errors.P_name.message}</p>
                                )}
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="email">Email <span>*</span></label>
                                <input className="form-control" type="email" {...register('email')} id="email" />
                                {errors.email && (
                                    <p className="erro_message">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="roll_name">Roll Name <span> * </span></label>
                                <select className="form-control" {...register('roll_name')} id="roll_name">
                                    <option value="">Select Role Name</option>
                                    {roles.map((role) => (
                                        <option key={role.role_id} value={role.role_id}>
                                            {role.role_name}
                                        </option>
                                    ))}
                                </select>
                                <div className="down_arrow_btn">
                                    <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
                                </div>
                                {errors.roll_name && (
                                    <p className="erro_message" >{errors.roll_name.message}</p>
                                )}
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="password">Password <span>*</span></label>
                                <input className="form-control" {...register('password')} type="text" id="password"/>
                                {errors.password &&(
                                    <p className="erro_message">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="inner_form_group inner_form_group_submit">
                                <input type="submit" className="submite_btn" value="Submit" />
                                <input type="submit" className="close_btn" value="Close" onClick={handleClose} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SystemSetting
