import React, { useEffect, useState } from "react";
import { database, auth } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseItem from "../components/ExpenseItem";

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <ExpenseForm />
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Expenses</h2>
        {expenses.map((expense) => (
          <ExpenseItem
            amount={expense.amount}
            description={expense.description}
            type={expense.type}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
