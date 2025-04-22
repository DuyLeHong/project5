import React from "react";

interface ExpenseItemProps {
  amount: number;
  description: string;
  type: string;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({
  amount,
  description,
  type,
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm mb-2">
      <div>
        <p className="text-lg font-medium">{description}</p>
        <p className="text-sm text-gray-500 capitalize">{type}</p>
      </div>
      <p
        className={`text-lg font-bold ${
          type === "income" ? "text-green-500" : "text-red-500"
        }`}
      >
        {type === "income" ? "+" : "-"}${amount}
      </p>
    </div>
  );
};

export default ExpenseItem;
