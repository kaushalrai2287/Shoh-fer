// // final code 
// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import Header from "../../../../../components/Header";
// import Sidemenu from "../../../../../components/Sidemenu";
// import { DataTable } from "../../../../../components/ui/datatable";

// import Link from "next/link";

// const BrandList = () => {
//     const [isToggled, setIsToggled] = useState(false); // State for toggle


//     const toggleClass = () => {
//         setIsToggled(!isToggled); // Toggle the state
//     };

//     const columns = {
//         Model: "Model",
//         Transmission_Type: "Transmission Type",
//     };

//     const data = [
//         {
//             Model: 'SUV',
//             Transmission_Type: 'Manual',
//             editLink: '#', // Edit page link
//             deleteLink: '#', // Delete page link
//         },
//     ];

//     const hiddenColumns = [];


//     return (
//         <main className="modal_list_main">
//             <Header />
//             <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
//                 <div className="inner_left">
//                     <Sidemenu onToggle={toggleClass} />
//                 </div>
//                 <div className="inner_right">
//                     <div className="filter_box">
//                         <div className="filter_heading_btnbox">
//                             <div className="service_form_heading">
//                                 <span>
//                                     <img src="/images/settings-sliders.svg" alt="" className="img-fluid" />
//                                 </span>
//                                 Filter By
//                             </div>
//                             <div className="filter_btn">
//                                 <Link href="/miscellaneous/model/add">
//                                     <button className="submite_btn">Add</button>
//                                 </Link>
//                             </div>
//                         </div>
//                         <div className="filter_formbox">
//                             <form action="">
//                                 <div className="inner_form_group">
//                                     <label htmlFor="model">Model</label>
//                                     <select className="form-control" name="model" id="model">
//                                         <option value="">Select Model</option>
//                                         <option value="Model one">Model one</option>
//                                         <option value="Model two">Model two</option>
//                                         <option value="Model three">Model three</option>
//                                     </select>
//                                     <div className="down_arrow_btn">
//                                         <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
//                                     </div>
//                                 </div>
//                                 <div className="inner_form_group">
//                                     <label htmlFor="brand">Transmission Type</label>
//                                     <select className="form-control" name="brand" id="brand">
//                                         <option value="">Select Transmission</option>
//                                         <option value="Automatic">Automatic</option>
//                                         <option value="Manual">Manual</option>
//                                         <option value="Clutchless Manual">Clutchless Manual</option>
//                                     </select>
//                                     <div className="down_arrow_btn">
//                                         <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
//                                     </div>
//                                 </div>
//                                 <div className="inner_form_group inner_form_group_submit">
//                                     <input type="submit" className='submite_btn' value="Search" />
//                                     <input type="submit" className='close_btn' value="Export All" />
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                     <div className="data_listing_box mt-3">
//                         <div className="filter_heading_btnbox">
//                             <div className="service_form_heading">
//                                 <span>
//                                     <img src="/images/bars-sort.svg" alt="" className="img-fluid" />
//                                 </span>
//                                 Model List
//                             </div>
//                         </div>
//                         <div className="filter_data_table">
//                             <DataTable columns={columns} data={data} />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     )
// }

// export default BrandList
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import Header from "../../../../../components/Header";
import Sidemenu from "../../../../../components/Sidemenu";
import { DataTable } from "../../../../../components/ui/datatable";
import { createClient } from "../../../../../utils/supabase/client";

const supabase = createClient();

const BrandList = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [models, setModels] = useState<any[]>([]);
  const [modelOptions, setModelOptions] = useState<string[]>([]);

  const toggleClass = () => {
    setIsToggled(!isToggled);
  };

  useEffect(() => {
    const fetchModels = async () => {
      const { data, error } = await supabase
        .from("models")
        .select(`
          id,
          name,
          transmission,
          brand_id,
          segment_id,
          brands (
            id,
            name
          ),
          segments (
            id,
            name
          )
        `);
        // console.log("Fetched models:", data);

      if (error) {
        console.error("Error fetching models:", error.message);
      } else {
        setModels(data);
        setModelOptions(data.map((model: any) => model.name));
      }
    };

    fetchModels();
  }, []);
  

  const columns = {
     Brand: "Brand",
    Model: "Model",
    Transmission_Type: "Transmission Type",
   
    Segment: "Segment",
  };

  const data = models.map((model: any) => ({
    Model: model.name,
    Transmission_Type: model.transmission,
    Brand: model.brands?.name || "N/A",
    Segment: model.segments?.name || "N/A",
    editLink: `/miscellaneous/model/edit/${model.id}`,
    deleteLink: `/miscellaneous/model/delete/${model.id}`,
  }));

  return (
    <main className="modal_list_main">
      <Header />
      <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
        <div className="inner_left">
          <Sidemenu onToggle={toggleClass} />
        </div>
        <div className="inner_right">
          <div className="filter_box">
            <div className="filter_heading_btnbox">
              <div className="service_form_heading">
                <span>
                  <img src="/images/settings-sliders.svg" alt="" className="img-fluid" />
                </span>
                Filter By
              </div>
              <div className="filter_btn">
                <Link href="/miscellaneous/model/add">
                  <button className="submite_btn">Add</button>
                </Link>
              </div>
            </div>

            <div className="filter_formbox">
              <form action="">
                <div className="inner_form_group">
                  <label htmlFor="model">Model</label>
                  <select className="form-control" name="model" id="model">
                    <option value="">Select Model</option>
                    {modelOptions.map((modelName, index) => (
                      <option key={index} value={modelName}>
                        {modelName}
                      </option>
                    ))}
                  </select>
                  <div className="down_arrow_btn">
                    <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
                  </div>
                </div>

                <div className="inner_form_group">
                  <label htmlFor="transmission">Transmission Type</label>
                  <select className="form-control" name="transmission" id="transmission">
                    <option value="">Select Transmission</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="Clutchless cManual">Clutchless Manual</option>
                  </select>
                  <div className="down_arrow_btn">
                    <img src="/images/angle-small-down.svg" alt="" className="img-fluid" />
                  </div>
                </div>

                <div className="inner_form_group inner_form_group_submit">
                  <input type="submit" className="submite_btn" value="Search" />
                  <input type="submit" className="close_btn" value="Export All" />
                </div>
              </form>
            </div>
          </div>

          <div className="data_listing_box mt-3">
            <div className="filter_heading_btnbox">
              <div className="service_form_heading">
                <span>
                  <img src="/images/bars-sort.svg" alt="" className="img-fluid" />
                </span>
                Model List
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

export default BrandList;
