import { Button, Typography } from "antd";
import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import mailIcon from "../../assets/mail.png";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useOtpVerifyMutation } from "../../redux/apiSlices/authSlice";

const { Text } = Typography;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [oneTimeCode, setOneTimeCode] = useState("");
  const email = new URLSearchParams(location.search).get("email");
  const [otpVerify, { isLoading, error }] = useOtpVerifyMutation();
  // Submit OTP
  const handleSubmit = async () => {
    try {
      if (oneTimeCode.length !== 6) {
        toast.error("Please enter a 6-digit OTP");
        return;
      }
      const res = await otpVerify({ email, oneTimeCode }).unwrap();
      if (res.success) {
        navigate(`/auth/login`);
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  // Resend OTP
  const handleResendEmail = () => {
    // Call backend resend API here
    toast.success(`OTP resent to ${email}`);
  };

  return (
    <div
      className="flex flex-col justify-center items-center p-4"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Mail Icon */}
      <img src={mailIcon} alt="KeyIcon" className="mb-6" />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[25px] font-semibold mb-2">Check your email</h1>
        <p className="mx-auto text-base text-[#667085] max-w-[300px]">
          We sent a password reset link to <b>{email}</b>
        </p>
      </div>

      {/* OTP Input */}
      <OTPInput
        value={oneTimeCode}
        onChange={setOneTimeCode}
        numInputs={6}
        isInputNum
        shouldAutoFocus
        containerStyle="justify-center gap-2 mb-6"
        inputStyle={{
          width: "50px",
          height: "50px",
          borderRadius: "8px",
          border: "1px solid #48B14C",
          fontSize: "20px",
          textAlign: "center",
        }}
        focusStyle={{
          outline: "none",
        }}
        isDisabled={false}
        renderInput={(props) => <input {...props} />}
      />

      {/* Submit Button */}
      <div className="w-full max-w-[300px]">
        <Button
          type="primary"
          size="large"
          block
          onClick={handleSubmit}
          disabled={oneTimeCode.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>

      {/* Resend */}
      <div className="mt-4 text-center text-[#667085]">
        Didn’t receive the email?{" "}
        <span
          className="text-primary font-semibold cursor-pointer"
          onClick={handleResendEmail}
        >
          Click to resend
        </span>
      </div>

      {/* Back to login */}
      <div className="mt-6">
        <a
          href="/auth/login"
          className="flex items-center justify-center gap-1 text-[#667085] hover:text-primary"
        >
          <ArrowLeft size={20} />
          <p>Back to log in</p>
        </a>
      </div>
    </div>
  );
};

export default VerifyOtp;
