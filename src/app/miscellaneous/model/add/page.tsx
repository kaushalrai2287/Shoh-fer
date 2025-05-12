"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "../../../../../components/Header";
import Sidemenu from "../../../../../components/Sidemenu";
import { createClient } from "../../../../../utils/supabase/client";

const supabase = createClient();

const formSchema = z.object({
  brand_id: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model name is required"),
  t_model: z.string().min(1, "Transmission type is required"),
  segment_id: z.string().min(1, "Segment is required"),
});

type FormValues = z.infer<typeof formSchema>;

const ModelAdd = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [segments, setSegments] = useState<{ id: string; name: string }[]>([]);
  const [submitMessage, setSubmitMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: brandsData } = await supabase
        .from("brands")
        .select("id, name")
        .order("name", { ascending: true });

      const { data: segmentData } = await supabase
        .from("segments")
        .select("id, name")
        .order("name", { ascending: true });

      if (brandsData) setBrands(brandsData);
      if (segmentData) setSegments(segmentData);
    };

    fetchData();
  }, []);

  const toggleClass = () => setIsToggled(!isToggled);

  const onSubmit = async (data: FormValues) => {
    const { error } = await supabase.from("models").insert([
      {
        name: data.model,
        transmission: data.t_model,
        brand_id: data.brand_id,
        segment_id: data.segment_id,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      setSubmitMessage("❌ Failed to add model.");
    } else {
      setSubmitMessage("✅ Model added successfully!");
      reset();
    }
  };

  return (
    <main className="add_brand_name">
      <Header />
      <div className={`inner_mainbox ${isToggled ? "toggled-class" : ""}`}>
        <div className="inner_left">
          <Sidemenu onToggle={toggleClass} />
        </div>
        <div className="inner_right">
          <div className="add_service_formbox">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="service_form_heading">Basic Information</div>

              {/* Brand Dropdown */}
              <div className="inner_form_group">
                <label htmlFor="brand_id">Brand <span>*</span></label>
                <select
                  id="brand_id"
                  className="form-control"
                  {...register("brand_id")}
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {errors.brand_id && (
                  <p className="erro_message">{errors.brand_id.message}</p>
                )}
              </div>

              {/* Segment Dropdown */}
              <div className="inner_form_group">
                <label htmlFor="segment_id">Segment <span>*</span></label>
                <select
                  id="segment_id"
                  className="form-control"
                  {...register("segment_id")}
                >
                  <option value="">Select Segment</option>
                  {segments.map((seg) => (
                    <option key={seg.id} value={seg.id}>
                      {seg.name}
                    </option>
                  ))}
                </select>
                {errors.segment_id && (
                  <p className="erro_message">{errors.segment_id.message}</p>
                )}
              </div>

              {/* Model Name */}
              <div className="inner_form_group">
                <label htmlFor="model">Model <span>*</span></label>
                <input
                  id="model"
                  type="text"
                  className="form-control"
                  placeholder="Enter model name"
                  {...register("model")}
                />
                {errors.model && (
                  <p className="erro_message">{errors.model.message}</p>
                )}
              </div>

              {/* Transmission Type */}
              <div className="inner_form_group">
                <label htmlFor="t_model">
                  Transmission Type <span>*</span>
                </label>
                <select
                  id="t_model"
                  className="form-control"
                  {...register("t_model")}
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Clutchless Manual">Clutchless Manual</option>
                </select>
                {errors.t_model && (
                  <p className="erro_message">{errors.t_model.message}</p>
                )}
              </div>

              {/* Submit Message */}
              {submitMessage && (
                <div className="form_success_message">{submitMessage}</div>
              )}

              {/* Submit Buttons */}
              <div className="inner_form_group inner_form_group_submit">
                <input type="submit" className="submite_btn" value="Submit" />
                <input
                  type="button"
                  className="close_btn"
                  value="Close"
                  onClick={() => reset()}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ModelAdd;
