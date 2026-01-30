import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "../store/expense-tracker-context";
import { db } from "../firebaseSetup/firebaseConfig";

import DashboardHeader from "./dashboard-header";
import BudgetProgress from "./budget-progress";
import AddExpense from "./add-expense";
import ExpenseSummary from "./expense-summary";
import ExpenseChart from "./expense-chart";
import ExpenseBarChart from "./bar-chart";
import ExpenseList from "./expense-list";

const Dashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "expenses"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#141414] px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-[#FFF0C4] text-center mb-10">
        Expense Dashboard
      </h1>

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <DashboardHeader />

        <BudgetProgress />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3">
            <AddExpense />
          </div>
          <div className="lg:w-2/3">
            <ExpenseList />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2">
            <ExpenseChart expenses={expenses} />
          </div>
          <div className="lg:w-1/2">
            <ExpenseBarChart expenses={expenses} />
          </div>
        </div>

        <ExpenseSummary expenses={expenses} />
      </div>
    </div>
  );
};

export default Dashboard;

