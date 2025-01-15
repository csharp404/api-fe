import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function VerificationCode() {
  const { email } = useParams();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (value, index) => {
    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6 || isNaN(otpValue)) {
      setMessage("OTP must be a 6-digit number.");
      setIsSuccess(false);
      return;
    }

    try {
      const response = await axios.post(
        `https://localhost:7127/api/Account/VerifyOtp`,
        { email, otp: otpValue }
      );
      if (
        response.status === 200 &&
        response.data.tokenString !== "Failed Login otp is wrong"
      ) {
        localStorage.setItem("token", response.data.tokenString);
        window.location.href = "/";
      } else {
        setMessage("Invalid OTP.");
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Error verifying OTP. Please try again.");
      setIsSuccess(false);
    }
  };

  return (
    <div className="otp-card">
      <form onSubmit={handleVerify}>
        <div className="otp-input-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleInputChange(e.target.value, index)}
              maxLength="1"
              pattern="\d"
              className="otp-input"
            />
          ))}
        </div>
        <button type="submit">Verify</button>
      </form>
      <p style={{ color: isSuccess ? "green" : "red" }}>{message}</p>
    </div>
  );
}
