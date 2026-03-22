"use client";

import { group, log } from "console";
import { useState, useEffect,useMemo} from "react";

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
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [type, setType] = useState<"INCOME" | "EXPENSE" | "-">("-");

  //  Edit Transaction
  const [toggleEdit, setToggleEdit] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // calculate Transaction
  // let total = 0;
  // let totalIncome = 0;
  // let totalExpense = 0;

  // const calculateBalance = () => {
  //   transactions.map((e) => {
  //     if (e.type === "INCOME") {
  //       totalIncome += e.amount;
  //     } else if (e.type === "EXPENSE") {
  //       totalExpense += e.amount;
  //     }

  //     total = e.type === "INCOME" ? total + e.amount : total - e.amount;
  //   });
  // };

  // calculateBalance();



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
    if (type === "-") {
      alert("Enter INCOME or EXPENSE");
      return;
    }
    if(amount <= 0){
      alert("กรอกตัวเลขที่มากกว่า 0 ")
      return 
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

  const deleteTransaction = async (id: string) => {
    if(!window.confirm("ต้องการลบรายการนี้หรือไม่")) return
    try {
      const res = await fetch(`http://localhost:3001/expenses/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        fetchTransaction();
      }
    } catch (err) {
      console.log("delete transaction fail : ", err);
      alert("Delete Transaction fail");
    }
  };

  const updateTransaction = async () => {
    if (!editingTransaction) return;
    if(editingTransaction.amount <= 0){
      alert("โปรดกรอกตัวเลขมากกว่า 0")
       return
    }

    try {
      const res = await fetch(
        `http://localhost:3001/expenses/${editingTransaction.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingTransaction),
        },
      );

      if (res.ok) {
        alert("Edit Transacion done ");

        setToggleEdit(false);
        setEditingTransaction(null);
        fetchTransaction();
      }
    } catch (err) {
      console.log("Edite transaction fail : ", err);
      alert("update transaction fail");
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "INCOME" | "EXPENSE"
  >("ALL");
  const [dateSearch,setDateSearch] = useState("");
  const filterTransaction = transactions.filter((transaction) => {
    const matchSearch = transaction.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchType =
      filterStatus === "ALL" || transaction.type === filterStatus;

    
      const matchDate = 
        dateSearch === "" || new Date(transaction.date).getTime() === new Date(dateSearch).getTime();
      

    return matchSearch && matchType && matchDate  ;
  });

  const groupedTransactions = filterTransaction.reduce(
    (groups: { [key: string]: Transaction[] }, transaction) => {
      const date = transaction.date;

      if (!groups[date]) {
        groups[date] = []; // สร้างลิ้นชักใหม่
      }

      groups[date].push(transaction); // หยิบใส่ลอ้นชัก
      return groups;
    },
    {},
  );

  const sortedDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );


  const clearFilter = () =>{
    setSearchTerm("");
    setFilterStatus("ALL")
    setDateSearch("");
  }

  
  const {totalIncome,totalExpense,totalBalance} = useMemo(()=>{

    return filterTransaction.reduce((acc,curr)=>{
      if(curr.type === "INCOME"){
        acc.totalIncome += curr.amount
        // acc.totalBalance += curr.amount
      }
      else if(curr.type === "EXPENSE"){
        acc.totalExpense += curr.amount
       
      }
      acc.totalBalance = acc.totalIncome - acc.totalExpense
      return acc
    },{totalIncome : 0,totalExpense: 0 ,totalBalance : 0} as {
      totalIncome: number;
      totalExpense: number;
      totalBalance: number;
    }
  );
  },[filterTransaction])

  console.log("Date ttttt",new Date("2026-03-21").getTime())
  console.log("Group ", groupedTransactions);
  console.log("Group Sort", sortedDates);
  console.log("type", type);
  console.log("Editing Transaction : ", editingTransaction);
  return (
    <div className="bg-gray-400 text-white w-full h-full min-h-screen flex flex-col items-center ">
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
                value={amount === 0 ? "" : amount}
                onChange={(e) => setAmount(e.target.value === "" ? 0 :Number((e.target.value)))}
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
              <label htmlFor="" className="">
                Type
              </label>
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
        <div
          className={`flex flex-col  items-center mt-3 rounded-2xl
          

          `}
        >
          <h2>Balance</h2>
          <h3
            className={`p-3 rounded-sm
            ${totalBalance > 0 ? `bg-green-500` : `bg-red-500`}`}
          >
            {totalBalance.toLocaleString()}
          </h3>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h2>INCOME</h2>
            <p>{totalIncome.toLocaleString()}</p>
          </div>
          <div>
            <h2>EXPENSE</h2>
            <p>{totalExpense.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 bg-gray-600 p-5 rounded-2xl w-full max-w-md">
        <h1 className="font-bold text-2xl text-center">Transaction</h1>
        <div className="mt-3 flex flex-col justify-center">
          <input
            type="text"
            className="p-2 border border-white w-full rounded-sm outline-0"
            placeholder="search...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex justify-around items-center mt-5 w-full">
            {["ALL", "INCOME", "EXPENSE"].map((status) => {
              const countTransaction =
                status === "ALL"
                  ? transactions.length
                  : transactions.filter((e) => e.type === status).length;
              return (
                <button
                  key={status}
                  className={`p-3 rounded-full font-semibold 
                ${filterStatus === status ? "bg-gray-700" : "bg-gray-500"}
                `}
                  onClick={() => setFilterStatus(status as any)}
                >
                  {status} ({countTransaction})
                </button>
              );
            })}
          </div>
          <div className="flex justify-between mt-5">
            
          <input type="date"  value={dateSearch} onChange={(e)=> setDateSearch(e.target.value)} className="p-2 border border-white-2 rounded-xl outline-0 "/>
            <button onClick={()=> clearFilter()} className="bg-red-400 border border-1 p-2 rounded-sm">clear</button>
          </div>
        </div>

        <div className="flex flex-col mt-4">
          {
           sortedDates.length === 0 ? (
            <div className="flex text-center justify-center items-center"><p>ไม่พบรายการ</p></div>
           ) : sortedDates.map((date) => (
            <div key={date} className="mb-6">
              {/* Date (Divider) */}
              <div className="flex justify-between items-center border-b border-gray-500 pb-1 mb-2">
                <span className="text-grey-300 font-bold ">{date}</span>
                <span className="text-xs text-gray-400">
                  {groupedTransactions[date].length} รายการ{" "}
                </span>
              </div>

              {/* Transaction Show */}

              <div className="flex flex-col space-y-3">
                {groupedTransactions[date].map((e) => (
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
                        <h2 className="font-semibold text-xl">
                          {e.amount.toLocaleString()} baht
                        </h2>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <h2>{e.type}</h2>
                      <div className="flex justify-end space-x-3.5">
                        <button
                          className="bg-yellow-500 p-1 px-3 rounded-sm"
                          onClick={() => {
                            setEditingTransaction(e);
                            setToggleEdit(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 p-1 px-3 rounded-sm"
                          onClick={() => deleteTransaction(e.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {toggleEdit && editingTransaction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-2xl ">
              <div className="flex flex-col bg-gray-600 p-5 rounded-2xl">
                <h1 className="text-center text-3xl font-bold">
                  Editing Transaction
                </h1>

                <div className="flex space-x-5 mt-5">
                  <div className="flex flex-col">
                    <label htmlFor="" className="text-xl font-semibold">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingTransaction.title}
                      className="border border-black-2 rounded-sm p-2 outline-0"
                      onChange={(e) =>
                        setEditingTransaction({
                          ...editingTransaction,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="" className="text-xl font-semibold">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={editingTransaction.amount === 0 ? "" : editingTransaction.amount }
                      className="border border-black-2 rounded-sm p-2 outline-0"
                      onChange={(e) =>
                        setEditingTransaction({
                          ...editingTransaction,
                          amount: e.target.value === "" ? 0 : Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex space-x-2  mt-5 jutifly-center items-center">
                  <div className="flex flex-col">
                    <label htmlFor="" className="text-xl font-semibold">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editingTransaction.category}
                      className="border border-black-2 rounded-sm p-2 outline-0"
                      onChange={(e) =>
                        setEditingTransaction({
                          ...editingTransaction,
                          category: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col mx-3">
                    <label htmlFor="" className="text-xl font-semibold">
                      Type
                    </label>
                    <select
                      name=""
                      id=""
                      value={editingTransaction.type}
                      className="bg-gray-700 border border-black-2 rounded-sm p-2 outline-0"
                      onChange={(e) =>
                        setEditingTransaction({
                          ...editingTransaction,
                          type: e.target.value as any,
                        })
                      }
                    >
                      <option value="INCOME">INCOME</option>
                      <option value="EXPENSE">EXPENSE</option>
                    </select>
                  </div>
                </div>
                <div className="mt-2">
                  <label htmlFor="" className="text-xl font-semibold">
                    Date
                  </label>
                  <input
                    type="date"
                    className="flex border border-white p-2 rounded-sm "
                    value={editingTransaction.date}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex justify-end mt-3 space-x-3">
                  <button
                    className="bg-gray-400 text-black px-3 py-2 rounded-sm cursor-pointer"
                    onClick={() => setToggleEdit(false)}
                  >
                    cancle
                  </button>
                  <button
                    className="bg-yellow-500 px-3 py-2 rounded-sm cursor-pointer"
                    onClick={() => updateTransaction()}
                  >
                    update
                  </button>
                </div>
              </div>
            </div>
          )
          }
        </div>
      </div>
    </div>
  );
}
