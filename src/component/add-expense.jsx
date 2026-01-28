import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebaseSetup/firebaseConfig";
import { useAuth } from "../store/expense-tracker-context";

const AddExpense = () => {
  const { user } = useAuth();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    await addDoc(collection(db, "expenses"), {
      uid: user.uid,
      amount: Number(amount),
      category,
      date: Timestamp.fromDate(new Date(date)),
      notes,
      createdAt: Timestamp.now(),
    });

    setAmount("");
    setNotes("");
    setDate("");
  };

  return (
    <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg border border-red-400 rounded-3xl shadow-2xl p-6 mt-6">
      <h2 className="text-2xl font-bold text-white mb-4 text-center drop-shadow-lg">
        Add Expense
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          className="w-full px-4 py-2 bg-white/20 text-white rounded-xl border border-red-300 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 bg-white/20 text-white rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
        >
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Bills</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 bg-white/20 text-white rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
          required
        />

        <input
          type="text"
          placeholder="Notes (optional)"
          className="w-full px-4 py-2 bg-white/20 text-white rounded-xl border border-red-300 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button className="w-full py-2 rounded-xl font-bold text-white bg-linear-to-r from-orange-400 to-red-500 hover:scale-105 shadow-lg transition-all">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
