import React, { useEffect, useState } from "react";
import { database, auth } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseItem from "../components/ExpenseItem";
import moment from "moment";

interface Expense {
  id: string;
  amount: number;
  description: string;
  type: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }

    const expensesRef = ref(database, `expenses/${user.uid}`);
    const unsubscribe = onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedExpenses = [];
      for (const key in data) {
        loadedExpenses.push({ id: key, ...data[key] });
      }
      setExpenses(loadedExpenses);
    });

    return () => unsubscribe();
  }, [navigate]);

  const filteredExpenses =
    filterType === "all"
      ? expenses
      : expenses.filter((expense) => expense.type === filterType);

  const expenseTypes = Array.from(
    new Set(expenses.map((expense) => expense.type))
  );

  const groupExpensesByDate = (expenses: Expense[]) => {
    const group: Record<string, Expense[]> = {};

    expenses.forEach((expense) => {
      const date = moment(expense.date).format("DD-MM-YYYY");

      if (!group[date]) group[date] = [];

      group[date].push(expense);
    });

    return group;
  };

  const groupByDate = groupExpensesByDate(filteredExpenses);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <ExpenseForm />
      <div className="my-6 flex items-center">
        <label className="mr-4 font-medium text-gray-700 text-base">
          Lọc theo thể loại:
        </label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="min-w-[140px] border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm hover:border-blue-400"
        >
          <option value="all">Tất cả</option>
          {expenseTypes.map((expenseType) => (
            <option key={expenseType} value={expenseType}>
              {expenseType.charAt(0).toUpperCase() + expenseType.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Tổng hợp chi tiêu theo ngày:{" "}
        </h2>
        {Object.entries(groupByDate)
          .sort(
            ([dateA], [dateB]) =>
              moment(dateB, "DD-MM-YYYY").valueOf() -
              moment(dateA, "DD-MM-YYYY").valueOf()
          )
          .map(([date, expenses]) => (
            <div>
              <h3 className="text-lg font-semibold mb-2">{date}</h3>
              {expenses.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  amount={expense.amount}
                  description={expense.description}
                  type={expense.type}
                />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
