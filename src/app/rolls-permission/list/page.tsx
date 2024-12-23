"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../../../../components/Header";
import Sidemenu from "../../../../components/Sidemenu";
import { DataTable } from "../../../../components/ui/datatable";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";
import { CSVLink } from "react-csv"; // Import CSVLink
import HeadingBredcrum from "../../../../components/HeadingBredcrum";

interface Role {
  role_id: string;
  role_name: string;
}

const RollsPermission = () => {
  const [isToggled, setIsToggled] = useState(false); // State for toggle
  const [roles, setRoles] = useState<Role[]>([]); // State to store roles
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for errors
  const [roleNameFilter, setRoleNameFilter] = useState<string>(""); // State for role name filter

  const toggleClass = () => {
    setIsToggled(!isToggled); // Toggle the state
  };

  // Handle role name filter input change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoleNameFilter(e.target.value);
  };

  // Fetch roles from the API when the component mounts or when filter changes
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`/api/roles/getrolls?role_name=${roleNameFilter}`); // API endpoint to get roles with filter
        if (!response.ok) {
          throw new Error("Failed to fetch roles");
        }

        const { roles } = await response.json();
        setRoles(roles);
        setLoading(false); // Set loading to false when data is fetched
      } catch (err) {
        setError("Failed to fetch roles");
        setLoading(false); // Set loading to false on error
      }
    };

    fetchRoles(); // Call the function to fetch roles
  }, [roleNameFilter]); // Dependency on roleNameFilter to refetch roles when the filter changes

  const columns = {
    Role_Name: "Role Name",
  };

  // Map the fetched roles to the DataTable format
  const data = roles.map((role) => ({
    Role_Name: role.role_name,
    onDelete: () => handleDelete(role.role_id),
  }));

  const handleDelete = async (roleId: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        const supabase = createClient();

        const { error } = await supabase
          .from("roles")
          .delete()
          .eq("role_id", roleId);

        if (error) {
          throw new Error(error.message);
        }

        // If successful, remove the role from the state
        setRoles(roles.filter((role) => role.role_id !== roleId));
        alert("Role deleted successfully");
      } catch (err) {
        alert("Failed to delete role");
      }
    }
  };

  // Define custom headers for CSV export
  const headers = [
    { label: "Role ID", key: "role_id" },
    { label: "Role Name", key: "role_name" },
  ];

  if (loading) return <div>Loading...</div>; // Show loading text while fetching
  if (error) return <div>{error}</div>; // Show error message if fetching fails

  return (
    <main className="rolls_list_main">
      <Header />
      <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
        <div className="inner_left">
          <Sidemenu onToggle={toggleClass} />
        </div>
        <div className="inner_right">
        <HeadingBredcrum
            heading="Roles"
            breadcrumbs={[
              { label: "Home", link: "/", active: false },
              { label: "Roles List", active: true },
            ]}
          />
          <div className="filter_box">
            <div className="filter_heading_btnbox">
              <div className="service_form_heading">
                <span>
                  <img
                    src="/images/settings-sliders.svg"
                    alt=""
                    className="img-fluid"
                  />
                </span>
                Filter By
              </div>
              <div className="filter_btn">
                <Link href="/rolls-permission/add">
                  <button className="submite_btn">Add</button>
                </Link>
              </div>
            </div>
            <div className="filter_formbox">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="inner_form_group">
                  <label htmlFor="role_name">Role Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="role_name"
                    id="role_name"
                    value={roleNameFilter} // Bind input to state
                    onChange={handleFilterChange} // Update state on input change
                  />
                </div>
                <div className="inner_form_group inner_form_group_submit">
                  <input
                    type="submit"
                    className="submite_btn"
                    value="Search"
                    onClick={() => setRoleNameFilter(roleNameFilter)} // Trigger the filter
                  />
                  {/* Export All Button */}
                  <CSVLink
                    data={roles} // Data to be exported
                    headers={headers} // Custom headers
                    filename="roles.csv" // Filename for the CSV file
                    className="close_btn" // Class for styling
                  >
                    Export All
                  </CSVLink>
                  <div>
                    <input
                      type="button"
                      className="close_btn"
                      value="Clear"
                      onClick={() => setRoleNameFilter("")} // Clear filter
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="data_listing_box mt-3">
            <div className="filter_heading_btnbox">
              <div className="service_form_heading">
                <span>
                  <img
                    src="/images/user-list.svg"
                    alt=""
                    className="img-fluid"
                  />
                </span>
                Roll List
              </div>
            </div>
            <div className="filter_data_table">
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RollsPermission;
