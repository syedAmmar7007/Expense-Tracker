import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses }) => {
  const categories = {};

  expenses.forEach((e) => {
    categories[e.category] = (categories[e.category] || 0) + e.amount;
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: ["#ef4444", "#3b82f6", "#22c55e", "#eab308"],
      },
    ],
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-red-400 rounded-3xl shadow-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-4 text-center">
        Category Breakdown
      </h2>
      <Pie data={data} />
    </div>
  );
};

export default ExpenseChart;
