import { useMemo } from "react";
import { useAuth } from "../store/expense-tracker-context";

const ExpenseSummary = ({ expenses }) => {
  const { profile } = useAuth();

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const budget = profile?.monthlyBudget || 0;
  const remaining = budget - totalSpent;

  const percent = budget ? Math.min((totalSpent / budget) * 100, 100) : 0;

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-red-400 rounded-3xl shadow-2xl p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-4 text-center">
        Monthly Summary
      </h2>

      <div className="space-y-3 text-white">
        <p>
          Total Spent: <b>Rs {totalSpent}</b>
        </p>
        <p>
          Monthly Budget: <b>Rs {budget}</b>
        </p>
        <p>
          Remaining:{" "}
          <b className={remaining < 0 ? "text-red-400" : "text-green-400"}>
            Rs {remaining}
          </b>
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 mt-2">
          <div
            className="bg-linear-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;
