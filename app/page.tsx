"use client";

import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";

type Todo = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: "TODO" | "SUCCESS";
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editToggle, setEditToggle] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [filterStatus, setFilterStatus] = useState<"ALL" | "TODO" | "SUCCESS">(
    "ALL",
  );

  const [searchTerm, setSearchTerm] = useState("");

  console.log("name : ", name);
  console.log("description : ", description);
  console.log("StartDate : ", startDate);

  //Bar Graph

  const totalTasks = todos.length; // งานทั้งหมด
  const completedTasks = todos.filter((t) => t.status === "SUCCESS").length;

  //ป้องกัน totalTask เป็น 0 เพื่อไม่ให้เกิด Error Division by zero
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  useEffect(() => {
    fetchTodo();
  }, []);

  // Serach Function
  const filteredTodos = todos.filter((todo) => {
    const matchSearch =
      todo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === "ALL" || todo.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const fetchTodo = async () => {
    const res = await fetch("http://localhost:3001/todos");
    const data = await res.json();
    setTodos(data);
    console.log(data);
  };

  const handleSave = async () => {
    // condition audit name filed
    if (!name.trim()) {
      alert("Enter name todo");
      return;
    }

    // new Object Todo
    const newTodo = {
      name: name,
      description: description,
      startDate: startDate,
      endDate: endDate,
      status: "TODO",
    };

    try {
      // post

      const res = await fetch("http://localhost:3001/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", //แจ้งว่า backend ว่าส่ง json ไป
        },
        body: JSON.stringify(newTodo), //convert object to string
      });

      if (res.ok) {
        const updateData = await res.json();

        setTodos(updateData);
        alert("Save new todo");

        setName("");
        setDescription("");
        setStartDate("");
        setEndDate("");
      }
    } catch (err) {
      console.error("Error saving data ", err);
      alert("Save todo fail");
    }
  };

  const updateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "TODO" ? "SUCCESS" : "TODO";

    try {
      const res = await fetch(`http://localhost:3001/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
        );
      }
    } catch (err) {
      console.error("Failed to update status ", err);
    }

    console.log("id : ", id);
  };

  const deleteTodo = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/todos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        fetchTodo();
      }
    } catch (err) {
      console.error("Failed to delete todo ", err);
    }
  };
  // const updateTodo = async (id: string) => {
  //   const index = todos.findIndex((t) => t.id === id);

  //   if (index !== -1) {
  //   }
  // };

  console.log("todos : ", todos);
  console.log("Editing Todos : ", editingTodo);
  const handleUpdateConfirm = async () => {
    if (!editingTodo) return;

    try {
      const res = await fetch(`http://localhost:3001/todos/${editingTodo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTodo),
      });

      if (res.ok) {
        alert("editing success");
        setEditToggle(false);
        fetchTodo();
      }
    } catch (err) {
      console.error("Failed to update : ", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center  font-sans bg-gray-500">
      {/* Add Todo */}
      <div className="bg-gray-800 p-5 rounded-2xl flex flex-col justify-center">
        <h2 className="font-bold text-2xl text-center mb-5">To Do List</h2>
        <div className="flex flex-col justify-between">
          <label htmlFor="">name</label>
          <input
            type="text"
            className="border border-xl rounded-2xl p-2"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <div className="mt-3 flex flex-col justify-center">
          <label htmlFor="">description</label>
          <input
            type="text"
            name=""
            id=""
            className="mt-1 p-5 border bordere-2xl rounded-2xl"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>
        <div className="flex p-2 items-center justify-between">
          <div className=" flex flex-col ">
            <label htmlFor="">startDate</label>
            <input
              type="date"
              name=""
              id=""
              className="border p-2 rounded-2xl"
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="">EndDate</label>
            <input
              type="date"
              name=""
              id=""
              className="border p-2 rounded-2xl"
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
            />
          </div>
        </div>
        <button className="bg-green-600 p-2 rounded-md" onClick={handleSave}>
          save
        </button>
      </div>

      {/* Show Todo */}
      <div className="bg-gray-800 p-5 mt-5 rounded-2xl flex flex-col justify-center items-center">
        {/* Search Todo  */}
        <div className="flex flex-col">
          <input
            className="bg-gray-700 rounded-xl p-3 w-100"
            type="text"
            value={searchTerm}
            placeholder="Search Todo"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* progress bar */}
        <div className="w-full max-w-md px-4">
          <div className="flex justify-between mt-3">
            <h3>Daily Progress</h3>
            <h3>{Math.round(progress)}%</h3>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden border border-gray-700">
            <div
              className={`${
                progress < 50 ? `bg-yellow-500`:"bg-green-500"
              } h-full transition-all duration-500 ease-out`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-end mt-2 text-sm text-gray-400">
            <span>{completedTasks} of {totalTasks} task completed </span>
          </div>
        </div>

        <div className="mt-5 flex justify-center items-center space-x-5 w-full">
          {["ALL", "TODO", "SUCCESS"].map((status) => {
            const countStatus =
              status === "ALL"
                ? todos.length
                : todos.filter((t) => t.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${
                  filterStatus === status
                    ? "bg-blue-500 text-white shadow-lg scale-105"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                {status} ({countStatus})
              </button>
            );
          })}
        </div>

        {/* Show Todo List */}
        <div className="bg-gray-700  p-5 mt-5 rounded-2xl flex flex-col justify-center items-center">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((e, i) => (
              <div
                key={e.id}
                className="bg-gray-500 w-100  flex flex-col justify-center space-x-5 mt-5 p-3 rounded-xl"
              >
                <div className="flex justify-between">
                  <p
                    style={{
                      backgroundColor: e.status == "TODO" ? "orange" : "green",
                      color: e.status == "TODO" ? "black" : "white",
                    }}
                    className="bg-green-200 w-25 text-center rounded-xl px-2"
                  >
                    {e.status}
                  </p>

                  <button
                    onClick={() => updateStatus(e.id, e.status)}
                    style={{
                      background: e.status === "TODO" ? "green" : "red",
                    }}
                    className="px-2 rounded-full "
                  >
                    {e.status === "TODO" ? "✓" : "X"}
                  </button>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <h3 className="text-3xl font-semibold">{e.name}</h3>
                </div>
                <div className="my-4">
                  <h3 className="font-semibold">description</h3>
                  <p className="bg-gray-400 rounded-2xl p-2">{e.description}</p>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <p>Start : {e.startDate}</p>
                  <p>End : {e.endDate}</p>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    className="bg-yellow-500 px-5 py-2 rounded-xl mx-2"
                    onClick={() => {
                      setEditingTodo(e);
                      setEditToggle(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 px-5 py-2 rounded-xl"
                    onClick={() => deleteTodo(e.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>
              <p>ไม่พบรายการที่คุณตามหา</p>
            </div>
          )}
        </div>
      </div>

      {/* --- ส่วนของ Modal แก้ไขข้อมูล --- */}
      {editToggle && editingTodo && (
        <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm p-10  flex-col">
          <div className="bg-gray-800 rounded-2xl  w-full p-5 max-w-md border border-black">
            <h2 className="text-2xl font-bold text-center">Editing Task</h2>
            <div className="">
              <div className="mt-3 flex flex-col justify-center">
                <label htmlFor="" className="font-bold">
                  name{" "}
                </label>
                <input
                  className="mt-1 p-5 border bordere-2xl rounded-2xl"
                  type="text"
                  value={editingTodo.name}
                  onChange={(e) =>
                    setEditingTodo({ ...editingTodo, name: e.target.value })
                  }
                />
              </div>
              <div className="mt-3 flex flex-col justify-center">
                <label htmlFor="" className="font-bold">
                  description
                </label>
                <input
                  className="mt-1 p-5 border bordere-2xl rounded-2xl"
                  type="text"
                  value={editingTodo.description}
                  onChange={(e) =>
                    setEditingTodo({
                      ...editingTodo,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex space-x-5 mt-5">
                <div className="">
                  <label htmlFor="" className="font-bold">
                    startDate
                  </label>
                  <input
                    className="mt-1 p-5 border bordere-2xl rounded-2xl"
                    type="date"
                    name=""
                    id=""
                    value={editingTodo.startDate}
                    onChange={(e) =>
                      setEditingTodo({
                        ...editingTodo,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="">
                  <label htmlFor="" className="font-bold">
                    endDate
                  </label>
                  <input
                    className="mt-1 p-5 border bordere-2xl rounded-2xl"
                    type="date"
                    name=""
                    id=""
                    value={editingTodo.endDate}
                    onChange={(e) =>
                      setEditingTodo({
                        ...editingTodo,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-5">
              <button
                className="bg-gray-500 px-5 py-2 rounded-xl"
                onClick={() => setEditToggle(false)}
              >
                cancle
              </button>
              <button
                className="bg-green-500 px-5 py-2 rounded-xl"
                onClick={handleUpdateConfirm}
              >
                save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
