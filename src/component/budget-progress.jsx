import { useAuth } from "../store/expense-tracker-context";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseSetup/firebaseConfig";

const BudgetProgress = () => {
  const { user, profile } = useAuth();
  const [totalSpent, setTotalSpent] = useState(0);

  const currency = profile?.currency || "PKR";
  const budget = profile?.monthlyBudget || 0;

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "expenses"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const total = snap.docs.reduce((sum, d) => sum + d.data().amount, 0);
      setTotalSpent(total);
    });

    return () => unsub();
  }, [user]);

  if (!budget) {
    return (
      <div className="bg-[#1A1A1A] border border-white/10 p-4 rounded-2xl text-white/70 text-center font-semibold">
        ⚠ Set monthly budget in profile to track progress
      </div>
    );
  }

  const percent = Math.min((totalSpent / budget) * 100, 100);
  const progressColor =
    percent < 70 ? "#22c55e" : percent < 90 ? "#facc15" : "#ef4444";

  return (
    <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/10">
      <div className="flex justify-between text-white/80 font-semibold mb-2 text-sm">
        <span>Monthly Budget</span>
        <span>
          {currency} {totalSpent} / {currency} {budget}
        </span>
      </div>

      <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden">
        <div
          className="h-4 transition-all duration-500 rounded-full"
          style={{ width: `${percent}%`, backgroundColor: progressColor }}
        />
      </div>
    </div>
  );
};

export default BudgetProgress;
