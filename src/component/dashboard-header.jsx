import { useAuth } from "../store/expense-tracker-context";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-[#2A2A2A] rounded-2xl px-5 py-4 shadow-lg shadow-black/40 gap-4">
      <div>
        <p className="text-[#CFCFCF] text-sm">Welcome back</p>
        <h2 className="text-xl font-semibold text-[#FFF0C4]">
          {profile?.name || "User"}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/profile")}
          className="px-4 py-2 rounded-xl bg-[#3E0703] hover:bg-[#660B05] text-[#FFF0C4] text-sm font-medium transition"
        >
          Profile
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-[#8C1007] hover:bg-[#660B05] text-[#FFF0C4] text-sm font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
