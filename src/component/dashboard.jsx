import AddExpense from "../component/add-expense";
import ExpenseList from "../component/expense-list";

const Dashboard = () => {
  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-red-600 via-orange-400 to-red-500 py-10 px-4">
        <h1 className="text-4xl font-extrabold text-white text-center mb-8 drop-shadow-lg">
          Expense Dashboard
        </h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Expense Card */}
          <AddExpense />

          {/* Expense List Card */}
          <ExpenseList />
        </div>
      </div>{" "}
    </>
  );
};

export default Dashboard;
