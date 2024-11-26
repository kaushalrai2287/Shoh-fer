"use client";

// import { passwordSchema } from "../../../validation/passwordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginUser } from "./action";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),  
});

export default function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });

      if (response.error) {
        setServerError(response.message);
      } else {
        // Redirect on successful login
        router.push("/dashboard");
      }
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main_section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="login_mainbox">
              <div className="login_imgbox">
                <img src="/images/driver-image.png" alt="Login" className="img-fluid" />
              </div>
              <div className="login_formbox">
                <div className="login_form_heading">
                  <h1>Welcome to <span>Admin</span></h1>
                </div>
                <div className="login_form_para">
                  <p>Welcome back! Please login to your account</p>
                </div>
                <div className="login_form">
                  <form onSubmit={handleSubmit(onSubmit)}>
                 
                    <div className="form_group">
                      <div className="form_icon">
                        <img src="/images/username-icon.svg" alt="Username" className="img-fluid" />
                      </div>
                      <input
                        type="email"
                        {...register("email")}
                        placeholder="Email"
                      />
                      {errors.email && <p className="error">{errors.email.message}</p>}
                    </div>

                 
                    <div className="form_group">
                      <div className="form_icon">
                        <img src="/images/password-icon.svg" alt="Password" className="img-fluid" />
                      </div>
                      <input
                        type="password"
                        {...register("password")}
                        placeholder="Password"
                      />
                      {errors.password && <p className="error">{errors.password.message}</p>}
                    </div>

                   
                    <div className="form_group">
                      <label htmlFor="remember">Remember me</label>
                      <input type="checkbox" name="remember" id="remember" />
                    </div>

                  
                    <div className="form_group">
                      <input type="submit" value={isLoading ? "Please wait..." : "Sign in"} disabled={isLoading} />
                    </div>

                
                    {serverError && (
                      <div className="error_message">
                        <p>{serverError}</p>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
