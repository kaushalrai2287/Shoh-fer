"use client";
import React, { useState, useEffect } from "react";
import Header from "../../../../components/Header";
import Sidemenu from "../../../../components/Sidemenu";
import { DataTable } from "../../../../components/ui/datatable";
import { createClient } from "../../../../utils/supabase/client";
import { CSVLink } from "react-csv";
import HeadingBredcrum from "../../../../components/HeadingBredcrum";

interface Role {
  user_name: string;
  role_name: string;
}

const UserRoles = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleNameFilter, setRoleNameFilter] = useState<string>("");

  const supabase = createClient();

  const toggleClass = () => {
    setIsToggled(!isToggled);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoleNameFilter(e.target.value);
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);

        
        const { data, error } = await supabase
          .from("user_roles")
          .select(
            `
            user_id,
            role_id,
            users (name),
            roles (role_name)
          `
          )
          .ilike("roles.role_name", `%${roleNameFilter}%`); // Filter by role name if provided

        if (error) {
          setError(error.message);
          return;
        }

        if (data) {
         
          const transformedData: Role[] = data.map((item: any) => ({
            user_name: item.users?.name || "Unknown",
            role_name: item.roles?.role_name || "Unknown",
          }));
          setRoles(transformedData);
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError("Failed to fetch roles.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [roleNameFilter, supabase]);

  const columns = {
    User_Name: "User Name",
    Role_Name: "Role Name",
  };

  const data = roles.map((role) => ({
    User_Name: role.user_name,
    Role_Name: role.role_name,
  }));

  // if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
                    value={roleNameFilter}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="inner_form_group inner_form_group_submit">
                  <input
                    type="submit"
                    className="submite_btn"
                    value="Search"
                  />
                  <CSVLink
                    data={roles}
                    filename="roles.csv"
                    className="close_btn"
                  >
                    Export All
                  </CSVLink>
                  <div>
                    <input
                      type="button"
                      className="close_btn"
                      value="Clear"
                      onClick={() => setRoleNameFilter("")}
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
                Role List
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

export default UserRoles;
