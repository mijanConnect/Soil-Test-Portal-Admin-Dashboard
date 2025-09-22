import { Button, Checkbox, Form, Input } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import FormItem from "../../components/common/FormItem";
import image4 from "../../assets/image4.png";
import googleIcon from "../../assets/google-icon.png";
import { useUser } from "../../provider/User";
import { useLoginMutation } from "../../redux/apiSlices/authSlice";
import toast from "react-hot-toast";
// ✅ Dummy users
// const dummyUsers = [
//   {
//     email: "admin@example.com",
//     password: "admin123",
//     role: "ADMIN",
//   },
//   {
//     email: "user@example.com",
//     password: "user123",
//     role: "USER",
//   },
//   {
//     email: "employee@example.com",
//     password: "employee123",
//     role: "EMPLOYEE",
//   },
// ];

const Login = () => {
  const [login, { isLoading, isError }] = useLoginMutation();
  const navigate = useNavigate();
  const { setUser } = useUser();

  const onFinish = async (values) => {
    try {
      const res = await login(values).unwrap();
      console.log(res);
      if (res.success) {
        navigate("/submission-management");
        // setUser(res.data);
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success(res.message);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <img src={image4} alt="logo" className="h-40 w-40 mx-auto" />
        {/* <h1 className="text-[25px] font-semibold mb-[10px] mt-[20px]">
          Merchants Dashboard
        </h1> */}
        <p className="mt-6">Welcome back! Please enter your details.</p>
      </div>
      <Form onFinish={onFinish} layout="vertical">
        <FormItem
          name={"email"}
          label={"Email"}
          rules={[
            { required: true, message: "Please input your Email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        />

        <Form.Item
          name="password"
          label={<p>Password</p>}
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            type="password"
            placeholder="Enter your password"
            style={{
              height: 40,
              border: "1px solid #48B14C",
              outline: "none",
              boxShadow: "none",
              borderRadius: "200px",
            }}
          />
        </Form.Item>

        {isError && (
          <p
            style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
          >
            {isError}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Form.Item
            style={{ marginBottom: 0 }}
            name="remember"
            valuePropName="checked"
          >
            {/* <Checkbox>Remember me</Checkbox> */}
          </Form.Item>

          <a
            className="login-form-forgot text-[#1E1E1E] hover:text-primary rounded-md font-semibold"
            href="/auth/forgot-password"
          >
            Forgot password
          </a>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <button
            htmlType="submit"
            type="submit"
            style={{
              width: "100%",
              height: 45,
              fontWeight: "400px",
              fontSize: "18px",
              marginTop: 20,
              borderRadius: "200px",
            }}
            className="flex items-center justify-center border border-primary bg-primary rounded-lg hover:bg-white text-white hover:text-primary transition"
          >
            Sign in
          </button>
        </Form.Item>
      </Form>
      <div className="mt-[20px]">
        <p className="text-center text-[#1E1E1E]">
          Don't have an account?{" "}
          <a
            href="/auth/signup"
            className="text-primary hover:text-[#1E1E1E] font-semibold"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
