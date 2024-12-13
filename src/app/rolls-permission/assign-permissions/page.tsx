"use client";

import React, { useEffect, useState } from "react";
import { FieldError, useForm, Controller } from "react-hook-form";
import Select from "react-select"; // Correct import
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from '../../../../components/Header';
import Sidemenu from "../../../../components/Sidemenu";
import { createClient } from "../../../../utils/supabase/client";
interface Role {
    role_id: string;
    role_name: string;
}

const formSchema = z.object({
    P_name: z
        .string()
        .min(1, "Role Name is required")
        .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters"),
    email:z.string(),
    roll_name:z.string(),
    password:z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const SystemSetting = () => {
    const [isToggled, setIsToggled] = useState(false); 
    const [roles, setRoles] = useState<Role[]>([]); 
    const [error, setError] = useState<string | null>(null); 

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
    // const onSubmit = async (data: FormValues) => {
    //     const supabase = createClient();
    
    //     try {
    //       const { error } = await supabase.auth.signUp({
    //         email: data.email,
    //         password: data.password,
        
    //       });
    
    //       if (error) {
    //         setError("Error creating user: " + error.message);
    //         return;
    //       }
    
    //       alert("User registered successfully!");
    //       reset();
    //     } catch (err) {
    //       setError("Something went wrong while registering.");
    //     }
    //   };
    const onSubmit = async (data: FormValues) => {
        const supabase = createClient();
    
        try {
          
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
            });
            console.log(authData);
    
            if (authError) {
                setError("Error creating user: " + authError.message);
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
                setError("Error inserting into custom users table: " + userError.message);
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
                        setError("Error assigning role to user: " + roleError.message);
                        return;
                        }

            // console.log(data);
    
            // Success
            alert("User registered successfully!");
            reset();
        } catch (err) {
            setError("Something went wrong while registering.");
        }
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
                                <label htmlFor="name">Name</label>
                                <input className="form-control" {...register('P_name')}type="text" id="name" />
                                {errors.P_name && (
                                    <p className="erro_message">{errors.P_name.message}</p>
                                )}
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="email">Email</label>
                                <input className="form-control" type="email" {...register('email')} id="email" />
                                {errors.email && (
                                    <p className="erro_message">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="inner_form_group">
                                <label htmlFor="roll_name">Roll Name</label>
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
                                <label htmlFor="password">Password</label>
                                <input className="form-control" {...register('password')} type="text" id="password" />
                                {errors.password &&(
                                    <p className="erro_message">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="inner_form_group inner_form_group_submit">
                                <input type="submit" className="submite_btn" value="Submit" />
                                <input type="submit" className="close_btn" value="Close" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SystemSetting
