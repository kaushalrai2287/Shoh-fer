"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../../components/Header";
import Sidemenu from "../../../../components/Sidemenu";
import { createClient } from "../../../../utils/supabase/client";

type ServiceCenter = {
service_center_id:number;
name: string ;
business_registration_no: string;	
document_upload: string	;
address: string	;
primary_contact_person: string;
contact_number: string ;	
email: string	;
alternate_contact: string	
city: string ;
pincode: string	;
state_id: number;	
services_id: number	;
service_area: string;	
password: string;	

};

const ListingPage = () => {
    const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
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
                    .select("*");

                if (error) throw error;

                setServiceCenters(data || []);
            } catch (err) {
                console.error("Error fetching service centers:", err);
            }
        };

        fetchServiceCenters();
    }, []);

    const handleEdit = (id: number) => {
        router.push(`/add-service-center/edit/${id}`);
    };

    return (
        <main className="service_center_list_main">
            <Header />
            <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
                <div className="inner_left">
                    <Sidemenu onToggle={toggleClass} />
                </div>
                <div className="inner_right">
                    <h1>Service Center List</h1>
                    <table>
                        <thead>
                            <tr>
                            {/* <th>service_center_id</th> */}
                                    <th>name</th>
                                 <th>business_registration_no</th>
                                  <th>document_upload</th>
                                   <th>address</th>
                                 <th>primary_contact_person</th>
                                <th>contact_number</th>
                                  <th>email</th>
                               <th>alternate_contact</th>
                               <th>city</th>
                              <th>pincode</th>
                             <th>state_id</th>
                             <th>services_id</th>
                             <th>service_area</th>
                            <th>password</th>

                              
                            </tr>
                        </thead>
                        <tbody>
                            {serviceCenters.map((center) => (
                                <tr key={center.service_center_id}>
                                    <td>{center.name}</td>
                               <td>{center.business_registration_no}</td>
                                 <td>{center.document_upload}</td>
                                     <td>{center.address}</td>
                                 <td>{center.primary_contact_person}</td>
                              <td>{center.contact_number}</td>
                                   <td>{center.email}</td>
                                 <td>{center.alternate_contact}</td>
                                      <td>{center.city}</td>
                                 <td>{center.pincode}</td>
                                 <td>{center.state_id}</td>
                                    <td>{center.services_id}</td>
                               <td>{center.service_area}</td>
                               <td>{center.password}</td>
                                    <td>
                                        <button onClick={() => handleEdit(center.service_center_id)}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default ListingPage;
