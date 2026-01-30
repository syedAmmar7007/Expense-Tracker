import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const categories = {};

  expenses.forEach((e) => {
    const expenseDate = e.date.toDate();
    if (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    ) {
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    }
  });

  if (Object.keys(categories).length === 0) {
    return (
      <p className="text-center text-white/70 mt-6">No expenses this month</p>
    );
  }

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          "#f97316",
          "#ef4444",
          "#22c55e",
          "#3b82f6",
          "#eab308",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-lg mx-auto mt-6 bg-[#141414] p-6 rounded-3xl border border-white/10 shadow-2xl">
      <h2 className="text-xl font-bold text-white mb-4 text-center">
        Monthly Category Breakdown
      </h2>
      <Pie data={data} />
    </div>
  );
};

export default ExpenseChart;
