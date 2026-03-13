"use client";

import { useState, useEffect } from "react";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
};

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>();
  const [category, setCategory] = useState<string>();
  const [type, setType] = useState<"INCOME" | "EXPENSE">();

  useEffect(() => {
    fetchTransaction();
  }, []);

  const fetchTransaction = async () => {
    const res = await fetch(`http://localhost:3001/expenses`);
    const data = await res.json();
    setTransactions(data);
    console.log(data);
  };

  console.log("type", type);

  return (
    <div className="bg-gray-400 w-full h-full min-h-screen flex flex-col items-center ">
      <div className="flex flex-col mt-5">
        <h1 className="font-bold text-5xl p-3">Expenses Tracking</h1>
        <div className="bg-gray-700 p-2">
          <div className="flex flex-col ">
            <label htmlFor="">Title</label>
            <input
              type="text"
              className="border border-black-2 rounded-sm p-2 outline-0"
            />
          </div>
          <div className="flex flex-col ">
            <label htmlFor="">Amount</label>
            <input
              type="number"
              className="border border-black-2 rounded-sm p-2 outline-0"
            />
          </div>
          <div className="flex flex-col ">
            <label htmlFor="">Type</label>
            <select
              name=""
              id=""
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="bg-gray-700 border border-black-2 rounded-sm p-2 outline-0"
            >
              <option value="INCOME">INCOME</option>
              <option value="EXPENSE">EXPENSE</option>
            </select>
          </div>

          <div className="flex flex-col ">
            <label htmlFor="">Category</label>
            <input
              type="text"
              className="border border-black-2 rounded-sm p-2 outline-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
