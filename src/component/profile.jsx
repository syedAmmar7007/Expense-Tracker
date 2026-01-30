import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseSetup/firebaseConfig";
import { useAuth } from "../store/expense-tracker-context";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("PKR");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setCurrency(data.currency || "PKR");
        setMonthlyBudget(data.monthlyBudget || "");
      }
    };
    fetchProfile();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setLoading(true);

    await setDoc(
      doc(db, "users", user.uid),
      {
        name,
        currency,
        monthlyBudget: Number(monthlyBudget),
        email: user.email,
        updatedAt: Date.now(),
      },
      { merge: true },
    );

    setLoading(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-[#141414] rounded-3xl shadow-2xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Profile Settings
      </h2>

      <input
        type="text"
        placeholder="Your Name"
        className="w-full mb-4 px-4 py-2 bg-[#1E1E1E] text-white rounded-xl border border-white/10 focus:outline-none"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="w-full mb-4 px-4 py-2 bg-[#1E1E1E] text-white rounded-xl border border-white/10"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <option value="PKR">PKR</option>
        <option value="USD">USD</option>
      </select>

      <input
        type="number"
        placeholder="Monthly Budget"
        className="w-full mb-6 px-4 py-2 bg-[#1E1E1E] text-white rounded-xl border border-white/10"
        value={monthlyBudget}
        onChange={(e) => setMonthlyBudget(e.target.value)}
      />

      <button
        onClick={saveProfile}
        disabled={loading}
        className="w-full py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {saved && (
        <p className="text-green-400 text-center mt-3">
          Profile updated successfully ✔
        </p>
      )}
    </div>
  );
};

export default Profile;
