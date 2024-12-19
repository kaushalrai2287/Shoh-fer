"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "../../../../utils/supabase/client"; // Ensure the Supabase client is imported correctly
import Header from "../../../../components/Header";
import Sidemenu from "../../../../components/Sidemenu";
import { useRouter } from "next/navigation";

// Validation Schema
const formSchema = z.object({
    role_name: z
        .string()
        .min(1, "Role Name is required")
        .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters"),
});

type FormValues = z.infer<typeof formSchema>;

const supabase = createClient(); // Initialize Supabase client

const RollsPermissionAdd = () => {
    const [isToggled, setIsToggled] = useState(false); // State for toggle
    const [permissions, setPermissions] = useState<{ permission_id: number; permission_name: string }[]>([]); // Permissions data
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]); // Selected permissions
const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    // Fetch permissions from Supabase
    useEffect(() => {
        const fetchPermissions = async () => {
            const { data, error } = await supabase.from("permissions").select("permission_id, permission_name");
            if (error) {
                console.error("Error fetching permissions:", error.message);
            } else {
                setPermissions(data || []);
            }
        };

        fetchPermissions();
    }, []);

    const handleClose = (event: { preventDefault: () => void }) => {
        
        event.preventDefault(); // Prevent default form behavior
        router.push("/rolls-permission/list"); // Navigate to the desired page
      };
    

    // Handle checkbox changes
    const handleCheckboxChange = (permissionId: number) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId) // Remove if already selected
                : [...prev, permissionId] // Add if not already selected
        );
    };

    const onSubmit = async (data: FormValues) => {
        try {
            const response = await fetch("/api/roles/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    role_name: data.role_name,
                    permissions: selectedPermissions,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.error);
                alert(`Error: ${errorData.error}`);
                return;
            }

            const result = await response.json();
            console.log("API Response:", result);
            alert("Role and permissions added successfully!");
        } catch (error) {
            console.error("Server Error:", error);
            alert("Something went wrong!");
        }
    };

    // Toggle menu
    const toggleClass = () => {
        setIsToggled(!isToggled);
    };

    return (
        <main className="add_rolls_permission_main">
            <Header />
            <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
                <div className="inner_left">
                    <Sidemenu onToggle={toggleClass} />
                </div>
                <div className="inner_right">
                    <div className="add_service_formbox checkbox_formbox">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="service_form_heading">Add Role</div>
                            <div className="inner_form_group">
                                <label htmlFor="name">Role Name <span>*</span></label>
                                <input className="form-control" {...register("role_name")} type="text" id="name" />
                                {errors.role_name && (
                                    <p className="erro_message">{errors.role_name.message}</p>
                                )}
                            </div>

                            <div className="service_form_heading service_form_heading_second">
                                Enable Permission <span>*</span>
                            </div>

                            {/* Dynamic Permissions Checkboxes */}
                            {permissions.map((permission) => (
                                <div key={permission.permission_id} className="inner_form_group inner_form_group_checkbox mb-2">
                                    <label htmlFor={`permission-${permission.permission_id}`}>
                                        {permission.permission_name}
                                    </label>
                                    <input
                                        type="checkbox"
                                        id={`permission-${permission.permission_id}`}
                                        onChange={() => handleCheckboxChange(permission.permission_id)}
                                    />
                                </div>
                            ))}

                            {/* Submit Buttons */}
                            <div className="inner_form_group inner_form_group_submit">
                                <input type="submit" className="submite_btn" value="Submit" />
                                <input type="button" className="close_btn" value="Close" onClick={handleClose} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default RollsPermissionAdd;
