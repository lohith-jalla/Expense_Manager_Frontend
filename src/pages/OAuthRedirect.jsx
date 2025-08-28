// src/pages/OAuth2Redirect.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuth2Redirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token !== null) {
      localStorage.setItem("jwtToken", token);
      navigate("/dashboard");
    }
  }, []);

  return <p>Redirecting...</p>;
}
