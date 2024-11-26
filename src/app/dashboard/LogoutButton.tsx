"use client";


import { logout } from "./action";

export default function LogoutButton() {
  return <button onClick={() => logout()}>Logout</button>;
}
