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
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<string>("");

  let total = 0;
  let totalIncome = 0;
  let totalExpense = 0;

  const calculateBalance = () => {
    transactions.map((e) => {
      if (e.type === "INCOME") {
        totalIncome += e.amount;
      } else if (e.type === "EXPENSE") {
        totalExpense += e.amount;
      }

      total = e.type === "INCOME" ? total + e.amount : total - e.amount;
    });
  };

  calculateBalance();

  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [type, setType] = useState<"INCOME" | "EXPENSE" | "-">("-");

  console.log("Date : ", date);
  useEffect(() => {
    fetchTransaction();
  }, []);

  const fetchTransaction = async () => {
    const res = await fetch(`http://localhost:3001/expenses`);
    const data = await res.json();
    setTransactions(data);
    console.log(data);
  };

  const addTransaction = async () => {
    if (!title.trim()) {
      alert("Title not found");
      return;
    }

    const newTransaction = {
      title: title,
      amount: amount,
      category: category,
      type: type,
      date: date,
    };

    try {
      const res = await fetch(`http://localhost:3001/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });

      if (res.ok) {
        const updateData = await res.json();
        setTransactions(updateData);
        alert("Save Transaction success");
        setTitle("");
        setAmount(0);
        setCategory("");
        setType("-");
        setDate(new Date().toISOString().split("T")[0]);
      }
    } catch (err) {
      console.log("Save Transaction fail : ", err);
      alert("Save transaction fail");
    }
  };

  console.log("type", type);

  return (
    <div className="bg-gray-400 w-full h-full min-h-screen flex flex-col items-center ">
      <div className="flex flex-col mt-5">
        <h1 className="font-bold text-5xl p-3">Expenses Tracking</h1>
        <div className="bg-gray-700 p-5 rounded-2xl">
          <div className="flex space-x-2">
            <div className="flex flex-col ">
              <label htmlFor="">Title</label>
              <input
                type="text"
                className="border border-black-2 rounded-sm p-2 outline-0"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="">Amount</label>
              <input
                type="number"
                className="border border-black-2 rounded-sm p-2 outline-0"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="flex flex-col ">
              <label htmlFor="">Category</label>
              <input
                type="text"
                value={category}
                className="border border-black-2 rounded-sm p-2 outline-0"
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="">Type</label>
              <select
              
                name=""
                id=""
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="bg-gray-700 border border-black-2 rounded-sm p-2 outline-0"
              >
                <option value="-">-</option>
                <option value="INCOME">INCOME</option>
                <option value="EXPENSE">EXPENSE</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col ">
            <label htmlFor="">Date</label>
            <input
              type="date"
              className="border border-black-2 rounded-sm p-2 outline-0"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="mt-5 flex justify-end">
            <button
              className="bg-green-500 rounded-sm px-3 py-2"
              onClick={addTransaction}
            >
              save
            </button>
          </div>
        </div>
      </div>
      <div className=" bg-gray-600 p-5 rounded-2xl mt-5 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Summary</h1>
        <div className={`flex flex-col  items-center mt-3 rounded-2xl
          

          `}>
          <h2>Balance</h2>
          <h3 className={`p-3 rounded-sm
            ${total > 0 ?`bg-green-500` : `bg-red-500`}`}>{total}</h3>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h2>INCOME</h2>
            <p>{totalIncome}</p>
          </div>
          <div>
            <h2>EXPENSE</h2>
            <p>{totalExpense}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 bg-gray-600 p-5 rounded-2xl w-full max-w-md">
        <h1 className="font-bold text-2xl text-center">Transaction</h1>
        <div className="flex flex-col">
          {transactions.map((e, i) => (
            <div
              key={e.id}
              className={`bg-gray-500 mt-3 p-3 rounded-xl border-l-10
                ${e.type === "INCOME" ? `border-green-500` : `border-red-500 `}

            `}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold">{e.title}</h2>
                  <h2>{e.category}</h2>
                </div>

                <div>
                  <h2 className="font-semibold text-xl">{e.amount} baht</h2>
                </div>
              </div>
              <div className="flex justify-between">
                <h2>{e.type}</h2>
                <h2>{e.date}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
