"use client";
import React, { useEffect, useState } from "react";

import Sidemenu from "../../../../components/Sidemenu";
import { DataTable } from "../../../../components/ui/datatable";
import Header from "../../../../components/Header";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import { CSVLink } from "react-csv";
import Link from "next/link";
import HeadingBredcrum from "../../../../components/HeadingBredcrum";

type ServiceCenter = {
  service_center_id: number;
  name: string;
  business_registration_no: string;
  document_upload: string;
  address: string;
  primary_contact_person: string;
  contact_number: string;
  email: string;
  alternate_contact: string;
  city: string;
  pincode: string;
  state_id: number;
  state_name: string;
  services_id: number;
  services_offerd: string;
  service_area: string;
  password: string;
  is_active: boolean;
};

const ListingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<ServiceCenter[]>([]);
  const [serviceAreaQuery, setServiceAreaQuery] = useState(""); // New state for Service Area
  const [cityAreaQuery, setCityAreaQuery] = useState("");
  const [contactNoQuery, setContactNoQuery] = useState("");
  const [isToggled, setIsToggled] = useState(false);
  const router = useRouter();

  const toggleClass = () => {
    setIsToggled(!isToggled);
  };

  useEffect(() => {
    const fetchServiceCenters = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("service_centers")
          .select(
            "*, states(name),service_centers_services_offerd(name),is_active"
          )
          .order("created_at", { ascending: false });

        const updatedData = data?.map((center: any) => ({
          ...center,
          state_name: center.states?.name || "",
          services_offerd: center.service_centers_services_offerd?.name || "",
        }));
        // console.log(updatedData);

        if (error) throw error;

        setServiceCenters(updatedData || []);
        setFilteredCenters(updatedData || []);
      } catch (err) {
        console.error("Error fetching service centers:", err);
      }
    };

    fetchServiceCenters();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const filtered = serviceCenters.filter((center) => {
      const matchesName =
        center.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const matchesArea =
        center.service_area
          ?.toLowerCase()
          .includes(serviceAreaQuery.toLowerCase()) || false;
      const matchesCity =
        center.city?.toLowerCase().includes(cityAreaQuery.toLowerCase()) ||
        false;
      const contactNo =
        center.contact_number
          ?.toLowerCase()
          .includes(contactNoQuery.toLocaleLowerCase()) || false;

      return matchesName && matchesArea && matchesCity && contactNo;
    });

    setFilteredCenters(filtered);
  };

  const handleEdit = (id: number) => {
    router.push(`/add-service-center/edit/${id}`);
  };
  const handleStatusToggle = async (id: number, currentStatus: boolean) => {
    const confirmToggle = window.confirm(
      "Are you sure you want to change the status?"
    );
    if (!confirmToggle) return;

    try {
      const supabase = createClient();

      // Show a loading indicator
      setIsToggled(true); // Optionally use a separate loading state

      // Toggle the status
      const { error } = await supabase
        .from("service_centers")
        .update({ is_active: !currentStatus }) // Toggle status
        .eq("service_center_id", id);

      if (error) {
        console.error("Error updating service center status:", error);
        alert("Failed to update the status.");
        setIsToggled(false);
      } else {
        setServiceCenters((prev) =>
          prev.map((center) =>
            center.service_center_id === id
              ? { ...center, is_active: !currentStatus }
              : center
          )
        );
        setFilteredCenters((prev) =>
          prev.map((center) =>
            center.service_center_id === id
              ? { ...center, is_active: !currentStatus }
              : center
          )
        );
        alert("Status updated successfully.");
        setIsToggled(false); // Hide loading indicator
      }
    } catch (err) {
      console.error("Unexpected error updating status:", err);
      alert("An unexpected error occurred.");
      setIsToggled(false); // Hide loading indicator
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service center?"
    );
    if (!confirmDelete) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("service_centers")
        .delete()
        .eq("service_center_id", id);

      if (error) {
        console.error("Error deleting service center:", error);
        alert("Failed to delete the service center.");
      } else {
        alert("Service center deleted successfully.");
        setServiceCenters((prev) =>
          prev.filter((center) => center.service_center_id !== id)
        );
        setFilteredCenters((prev) =>
          prev.filter((center) => center.service_center_id !== id)
        );
      }
    } catch (err) {
      console.error("Unexpected error deleting service center:", err);
      alert("An unexpected error occurred.");
    }
  };

  const columns = {
    name: "Service Center Name",
    business_registration_no: "Registration Number",
    services_id: "Services Offered",
    service_area: "Area",
    document_upload: "Document",
    primary_contact_person: "Contact Person",
    contact_number: "Contact No.",
    email: "Email",
    alternate_contact: "Alt Contact",
    address: "Address",
    city: "City",
    state_id: "State",
    pincode: "Pincode",
    // status: "Status",
    Status: "Status",
  };

  const hiddenColumns = [
    "business_registration_no",
    "services_id",
    "document_upload",
    "primary_contact_person",
    "alternate_contact",
    "address",
    "state_id",
    "pincode",
  ];

  // Map service centers to the table format
  const mappedData = filteredCenters.map((center) => ({
    name: center.name,
    business_registration_no: center.business_registration_no,
    services_id: center.services_offerd,
    service_area: center.service_area,
    document_upload: center.document_upload,
    primary_contact_person: center.primary_contact_person,
    contact_number: center.contact_number,
    email: center.email,
    alternate_contact: center.alternate_contact,
    address: center.address,
    city: center.city,
    state_id: center.state_name,
    pincode: center.pincode,

    Status: (
      <span
        onClick={() =>
          handleStatusToggle(center.service_center_id, center.is_active)
        }
        style={{
          cursor: "pointer",
          color: center.is_active ? "green" : "red",
          fontWeight: "bold",
        }}
      >
        {center.is_active ? "Active" : "Inactive"}
      </span>
    ),

    onEdit: () => handleEdit(center.service_center_id),
    //  deleteLink: '#',
    onDelete: () => handleDelete(center.service_center_id),
  }));
  const handleClearFilters = () => {
    // Reset all input fields to empty strings
    setSearchQuery("");
    setServiceAreaQuery("");
    setCityAreaQuery("");
    setContactNoQuery("");

    // Reset the filtered list to show all service centers
    setFilteredCenters(serviceCenters);
  };

  return (
    <main className="Service_center_list_main">
      <Header />
      <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
        <div className="inner_left">
          <Sidemenu onToggle={toggleClass} />
        </div>
        <div className="inner_right">
          <HeadingBredcrum
            heading="Service Center List"
            breadcrumbs={[
              { label: "Home", link: "/", active: false },
              { label: "Service Center List", active: true },
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
                <button className="submite_btn">
                  <Link
                    className="text-white"
                    href="/add-service-center/create"
                  >
                    Add
                  </Link>
                </button>
              </div>
            </div>
            <div className="filter_formbox">
              <form onSubmit={handleSearchSubmit}>
                <div className="inner_form_group">
                  <label htmlFor="search_service_name">
                    Service Center Name
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="search_service_name"
                    id="search_service_name"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="inner_form_group">
                  <label htmlFor="search_service_area">Service Area</label>

                  <input
                    className="form-control"
                    type="text"
                    name="search_service_area"
                    id="search_service_area"
                    value={serviceAreaQuery}
                    onChange={(e) => setServiceAreaQuery(e.target.value)} // Update state on change
                  />
                </div>
                <div className="inner_form_group">
                  <label htmlFor="search_service_city">City</label>
                  <input
                    className="form-control"
                    type="text"
                    name="search_service_city"
                    id="search_service_city"
                    value={cityAreaQuery}
                    onChange={(e) => setCityAreaQuery(e.target.value)}
                  />
                </div>
                <div className="inner_form_group">
                  <label htmlFor="search_service_number">Contact Number</label>
                  <input
                    className="form-control"
                    type="text"
                    name="search_service_number"
                    id="search_service_number"
                    value={contactNoQuery}
                    onChange={(e) => setContactNoQuery(e.target.value)}
                  />
                </div>

                <div className="inner_form_group inner_form_group_submit">
                  <div>
                    <input
                      type="submit"
                      className="submite_btn"
                      value="Search"
                    />
                  </div>
                  <div>
                    {filteredCenters.length > 0 && (
                      <CSVLink
                        data={filteredCenters}
                        headers={[
                          { label: "Service Center Name", key: "name" },
                          {
                            label: "Registration Number",
                            key: "business_registration_no",
                          },
                          { label: "Services Offered", key: "services_offerd" },
                          { label: "Area", key: "service_area" },
                          { label: "City", key: "city" },
                          { label: "Contact No.", key: "contact_number" },
                          { label: "Email", key: "email" },
                        ]}
                        filename="service_centers.csv"
                        className="close_btn"
                      >
                        Export All
                      </CSVLink>
                    )}
                  </div>
                  <div>
                    <input
                      type="button"
                      className="close_btn"
                      value="Clear"
                      onClick={handleClearFilters} // Attach the handler here
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
                    src="/images/bars-sort.svg"
                    alt=""
                    className="img-fluid"
                  />
                </span>
                Service Center List
              </div>
            </div>
            <div className="filter_data_table">
              <DataTable
                columns={columns}
                data={mappedData}
                hiddenColumns={hiddenColumns}
                showStatusButton={true}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ListingPage;
