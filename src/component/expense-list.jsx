import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseSetup/firebaseConfig";
import { useAuth } from "../store/expense-tracker-context";
import { categories } from "../store/categories";

const ExpenseList = () => {
  const { user, profile } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [editId, setEditId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("Food");
  const [editDate, setEditDate] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "expenses"),
      where("uid", "==", user.uid),
      orderBy("date", "desc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  const filteredExpenses = expenses.filter((exp) => {
    const matchesCategory =
      selectedCategory === "All" || exp.category === selectedCategory;
    const matchesStart = startDate
      ? exp.date.toDate() >= new Date(startDate)
      : true;
    const matchesEnd = endDate ? exp.date.toDate() <= new Date(endDate) : true;
    return matchesCategory && matchesStart && matchesEnd;
  });

  const startEdit = (exp) => {
    setEditId(exp.id);
    setEditAmount(exp.amount);
    setEditCategory(exp.category);
    setEditNotes(exp.notes || "");
    setEditDate(exp.date.toDate().toISOString().split("T")[0]);
  };

  const updateExpense = async () => {
    await updateDoc(doc(db, "expenses", editId), {
      amount: Number(editAmount),
      category: editCategory,
      notes: editNotes,
      date: Timestamp.fromDate(new Date(editDate)),
    });
    setEditId(null);
  };

  const deleteExpense = async (id) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, "expenses", id));
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 rounded-3xl bg-[#141414] border border-white/10 p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Expenses</h2>
        <select
          className="bg-[#1E1E1E] text-white text-sm px-3 py-1.5 rounded-xl border border-white/10"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option>All</option>
          {categories.map((cat) => (
            <option key={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 mb-5">
        <input
          type="date"
          className="flex-1 bg-[#1E1E1E] text-white text-sm px-3 py-2 rounded-xl border border-white/10"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="flex-1 bg-[#1E1E1E] text-white text-sm px-3 py-2 rounded-xl border border-white/10"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filteredExpenses.length === 0 && (
          <p className="text-center text-white/50 text-sm">No expenses found</p>
        )}

        {filteredExpenses.map((exp) => {
          const cat = categories.find((c) => c.name === exp.category);
          return (
            <div
              key={exp.id}
              className="flex items-center justify-between bg-[#1A1A1A] px-4 py-3 rounded-2xl border border-white/5"
            >
              {editId === exp.id ? (
                <div className="w-full space-y-2">
                  <input
                    type="number"
                    className="w-full bg-[#1E1E1E] text-white px-3 py-2 rounded-xl"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                  />
                  <select
                    className="w-full bg-[#1E1E1E] text-white px-3 py-2 rounded-xl"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    className="w-full bg-[#1E1E1E] text-white px-3 py-2 rounded-xl"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Notes"
                    className="w-full bg-[#1E1E1E] text-white px-3 py-2 rounded-xl"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={updateExpense}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-xl"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="flex-1 bg-gray-600 text-white py-2 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                      {cat?.icon || "❓"}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {exp.category}
                      </p>
                      <p className="text-xs text-white/50">
                        {exp.date.toDate().toDateString()}
                      </p>
                      {exp.notes && (
                        <p className="text-white/50 text-xs italic mt-1">
                          {exp.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {profile?.currency || "PKR"} {exp.amount}
                    </p>
                    <div className="flex gap-2 justify-end text-xs mt-1">
                      <button
                        onClick={() => startEdit(exp)}
                        className="text-blue-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseList;
