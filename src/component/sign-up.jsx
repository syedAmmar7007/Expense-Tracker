import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/expense-tracker-context";
import { useState } from "react";

const SignUp = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const password = watch("password");

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      await signUp(data);
      reset();
      alert("Account Created Successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-600 via-orange-400 to-red-500 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-red-400 rounded-3xl shadow-2xl p-10">
        <h1 className="text-5xl font-extrabold text-center text-white mb-4 drop-shadow-lg">
          Create Account
        </h1>
        <p className="text-center text-white/80 mb-8">
          Manage Your Expenses Easily
        </p>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm text-white/80 mb-2">
              Full Name
            </label>
            <input
              placeholder="Full Name"
              type="text"
              {...register("name", { required: true })}
              className="w-full px-5 py-3 bg-white/20 text-white rounded-xl border border-red-300 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">Email</label>
            <input
              placeholder="Email"
              type="email"
              {...register("email", { required: true })}
              className="w-full px-5 py-3 bg-white/20 text-white rounded-xl border border-red-300 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">Password</label>
            <input
              placeholder="Password"
              type="password"
              {...register("password", { required: true })}
              className="w-full px-5 py-3 bg-white/20 text-white rounded-xl border border-red-300 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">
              Confirm Password
            </label>
            <input
              placeholder="Confirm Password"
              type="password"
              {...register("confirmPassword", {
                validate: (v) => v === password || "Passwords do not match",
              })}
              className="w-full px-5 py-3 bg-white/20 text-white rounded-xl border border-red-300 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">
              Monthly Budget (optional)
            </label>
            <input
              placeholder="Monthly Budget"
              type="number"
              {...register("monthlyBudget")}
              className="w-full px-5 py-3 bg-white/20 text-white rounded-xl border border-red-300 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white text-lg transition-all ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-linear-to-r from-orange-400 to-red-500 hover:scale-105 shadow-lg"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-white/80 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-300 font-semibold hover:text-white"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
