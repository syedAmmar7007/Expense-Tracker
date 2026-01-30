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
    setDate("");
    setNotes("");
  };

  return (
    <div className="max-w-lg mx-auto bg-[#141414] rounded-3xl shadow-2xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Add Expense
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 bg-[#1E1E1E] text-white rounded-xl border border-white/10 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 bg-[#1E1E1E] text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Others</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 bg-[#1E1E1E] text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />

        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 bg-[#1E1E1E] text-white rounded-xl border border-white/10 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />

        <button
          type="submit"
          className="w-full py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
