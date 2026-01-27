import { useForm } from "react-hook-form";
import { useAuth } from "../store/expense-tracker-context";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      let message = "Login failed. Please try again.";
      switch (error.code) {
        case "auth/user-not-found":
          message = "No account found with this email.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password.";
          break;
        case "auth/invalid-email":
          message = "Invalid email format.";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Try again later.";
          break;
      }
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-600 via-orange-400 to-red-500 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-red-400 rounded-3xl shadow-2xl p-10">
        <h1 className="text-5xl font-extrabold text-center text-white mb-8 drop-shadow-lg">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm text-white/80 mb-2">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Enter your email"
              className="w-full px-5 py-3 bg-white/20 text-white rounded-xl border border-red-300 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-white/80 mb-2">Password</label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              placeholder="Enter your password"
              className="w-full px-5 py-3 bg-white/20 text-white rounded-xl border border-red-300 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
            />
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white text-lg transition-all ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-linear-to-r from-orange-400 to-red-500 hover:scale-105 shadow-lg"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-white/80 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/"
            className="text-orange-300 font-semibold hover:text-white"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
