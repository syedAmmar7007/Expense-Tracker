import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../store/expense-tracker-context";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ExpenseBarChart = ({ expenses }) => {
  const { profile } = useAuth();
  const currency = profile?.currency || "PKR";

  const categoryTotals = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: `Expenses (${currency})`,
        data: Object.values(categoryTotals),
        backgroundColor: ["#ef4444", "#3b82f6", "#22c55e", "#eab308"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "white" },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${currency} ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: { ticks: { color: "white" }, grid: { color: "#2A2A2A" } },
      y: { ticks: { color: "white" }, grid: { color: "#2A2A2A" } },
    },
  };

  return (
    <div className="max-w-lg mx-auto mt-6 bg-[#141414] p-6 rounded-3xl border border-white/10 shadow-2xl">
      <h2 className="text-xl font-bold text-white mb-4 text-center">
        Monthly Expense Breakdown
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ExpenseBarChart;
