"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "./login.css";
import { apiFetch } from "@/lib/api";

interface LoginRow {
  Result?: string;
  UserId?: string;
  UserName?: string;
  UserRole?: string;
}

interface LoginResponse {
  IsSuccess?: boolean;
  Data?: LoginRow[];
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await apiFetch<LoginResponse>("UserLogin/Vallidateuser", {
        method: "POST",
        body: JSON.stringify({ UserId: username, Password: password }),
      });

      const row = result.Data?.[0];

      if (result.IsSuccess === true && row?.Result === "Valid User") {
        if (row.UserId) sessionStorage.setItem("UserId", row.UserId);
        if (row.UserName) sessionStorage.setItem("UserName", row.UserName);
        if (row.UserRole) sessionStorage.setItem("UserRole", row.UserRole);

        await Swal.fire({
          title: "Login Successful!",
          text: "Redirecting...",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        router.push("/dashboard");
        return;
      }

      await Swal.fire({
        title: "Invalid Login!",
        text: "Please check your username or password.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } catch {
      await Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="forms-container">
          
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <a href="#">
                <img src="/ProjectFiles/smartopd-removebg-preview.png" width="60%" alt="Smart OPD" />
              </a>
              <p />
            </div>
          </div>
        </div>
        <div className="signin-signup">
            <form className="sign-in-form" id="loginForm" onSubmit={handleSubmit}>
              <h2 className="title">Sign in</h2>

              <div className="input-field">
                <i className="fa fa-user" />
                <input
                  type="text"
                  id="userid"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="input-field">
                <i className="fa fa-lock" />
                <input
                  type="password"
                  id="pass"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <input
                type="submit"
                value={loading ? "Logging in..." : "Login"}
                className="btn solid"
                disabled={loading}
              />
            </form>

            <form className="sign-up-form" onSubmit={(e) => e.preventDefault()}>
              <div className="input-field">
                <i className="fa fa-envelope" />
                <input type="email" placeholder="Email Your Personal Mail" required />
              </div>
              <input type="submit" className="btn" value="Sign up" />
            </form>

            <div className="login-footer-badge">
              <img src="/ProjectFiles/Fahmitlogo-Photoroom.png" alt="FAAHM Logo" />
              <div>
                © 2026 <strong>FAAHM I.T. SERVICE PVT. LTD.</strong>
                <br />
                <span>Innovating for a Connected Future. All Rights Reserved</span>
              </div>
            </div>
          </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
        }

        .login-page .container {
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          position: relative;
        }

        .login-footer-badge {
          position: fixed;
          bottom: -150px;
          right: 10px;
          background: linear-gradient(135deg, #ff8c00, #ffb347);
          color: #fff;
          padding: 12px 18px;
          border-radius: 10px;
          font-size: 13px;
          box-shadow: 0 4px 10px rgba(0,0,0,.25);
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 9999;
        }

        .login-footer-badge img {
          width: 40px;
          height: auto;
        }

        .login-footer-badge span {
          font-size: 12px;
        }

        .sign-in-form .btn:disabled {
          opacity: .7;
          cursor: wait;
        }
      `}</style>
    </div>
  );
}
