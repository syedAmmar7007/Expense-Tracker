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
  const { user } = useAuth();
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

    const unsub = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
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
    await deleteDoc(doc(db, "expenses", id));
  };

  return (
    <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg border border-red-400 rounded-3xl shadow-2xl p-6 mt-6">
      <h2 className="text-2xl font-bold text-white mb-4 text-center drop-shadow-lg">
        Your Expenses
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select
          className="w-full sm:w-1/2 px-3 py-2 bg-white/20 text-white rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option className="text-black">All</option>
          {categories.map((cat) => (
            <option key={cat.name} className="text-black">
              {cat.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2 w-full sm:w-1/2">
          <input
            type="date"
            className="w-1/2 px-3 py-2 bg-white/20 text-white rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="w-1/2 px-3 py-2 bg-white/20 text-white rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredExpenses.length === 0 && (
          <p className="text-center text-white/70">No expenses found</p>
        )}

        {filteredExpenses.map((exp) => {
          const cat = categories.find((c) => c.name === exp.category);

          return (
            <div
              key={exp.id}
              className="border border-red-300 rounded-xl p-3 flex flex-col gap-2 bg-white/5"
            >
              {editId === exp.id ? (
                <>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-white/20 text-white rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                  />

                  <select
                    className="w-full px-3 py-2 bg-white/20 text-white rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option className="text-black" key={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white/20 text-white rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />

                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-white/20 text-white rounded-xl border border-red-300 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={updateExpense}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`text-xl ${cat?.color || "bg-gray-400"}`}>
                      {cat?.icon || "❓"}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{exp.category}</p>
                      <p className="text-sm text-white/70">Rs {exp.amount}</p>

                      {exp.notes && exp.notes.trim() !== "" && (
                        <p className="text-xs text-white/60 mt-1">
                          📝 {exp.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(exp)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseList;
