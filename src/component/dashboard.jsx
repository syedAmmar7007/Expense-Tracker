import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebaseSetup/firebaseConfig";
import { useAuth } from "../store/expense-tracker-context";

import AddExpense from "./add-expense";
import ExpenseList from "./expense-list";
import ExpenseSummary from "./expense-summary";
import ExpenseChart from "./expense-chart";

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
    <div className="min-h-screen bg-linear-to-br from-red-600 via-orange-400 to-red-500 px-4 py-8">
      <h1 className="text-4xl font-extrabold text-white text-center mb-8">
        Expense Dashboard
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AddExpense />
        <ExpenseSummary expenses={expenses} />
        <ExpenseChart expenses={expenses} />
        <ExpenseList />
      </div>
    </div>
  );
};

export default Dashboard;
