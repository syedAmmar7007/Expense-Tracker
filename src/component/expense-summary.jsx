import { useMemo } from "react";
import { useAuth } from "../store/expense-tracker-context";

const ExpenseSummary = ({ expenses }) => {
  const { profile } = useAuth();
  const currency = profile?.currency || "PKR";

  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses],
  );
  const budget = profile?.monthlyBudget || 0;
  const remaining = budget - totalSpent;

  return (
    <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/10 shadow-md mt-6">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div>
          <p className="text-white/80 text-sm">Total Spent:</p>
          <p className="text-white font-semibold text-lg">
            {currency} {totalSpent}
          </p>
        </div>
        <div>
          <p className="text-white/80 text-sm">Monthly Budget:</p>
          <p className="text-white font-semibold text-lg">
            {currency} {budget}
          </p>
        </div>
        <div>
          <p className="text-white/80 text-sm">Remaining:</p>
          <p
            className={`font-semibold text-lg ${remaining < 0 ? "text-red-500" : "text-green-400"}`}
          >
            {currency} {remaining}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;
