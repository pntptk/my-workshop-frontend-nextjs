"use client";

import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import { start } from "repl";

type Todo = {
  id:number;
  name:string;
  description:string;
  startDate:string;
  endDate:string;
  duration:number;
  status:"TODO"|"SUCCESS";

}

export default function Home() {

const [todos,setTodos] = useState<Todo[]>([])


  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  console.log("name : ", name);
  console.log("description : ", description);
  console.log("StartDate : ", startDate);

  useEffect(()=>{
    fetchTodo();

   
   
    


  },[])

  const fetchTodo = async()=>{
    const res = await fetch("http://localhost:3001/todos")
    const data = await res.json();
    setTodos(data);
    console.log(data);
  } 

    console.log("todos : ",todos);


  return (
    <div className="flex flex-col min-h-screen items-center justify-center  font-sans bg-gray-500">
      <div className="bg-gray-800 p-5 rounded-2xl flex flex-col justify-center">
        <h2 className="font-bold text-2xl text-center mb-5">To Do List</h2>
        <div className="flex flex-col justify-between">
          <label htmlFor="">name</label>
          <input
            type="text"
            className="border border-xl rounded-2xl p-2"
            onChange={(e) => setName(e.target.value)}
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
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="">EndDate</label>
            <input
              type="date"
              name=""
              id=""
              className="border p-2 rounded-2xl"
              onChange={(e)=>setEndDate(e.target.value)}
            />
          </div>
        </div>
        <button className="bg-green-600 p-2 rounded-md">save</button>
      </div> 
      <div className="bg-gray-800 min-h-50 min-w-90 mt-5 rounded-2xl flex flex-col justify-center items-center">
        <h1>To Do</h1>
        <div className="flex">

          {
            todos.map((e,i)=>(
              <div key={e.id} className="flex bg-gray-500 p-5 rounded-xl">
                <h3>{e.name}</h3>
                <p>{e.description}</p>
                <p>{e.startDate}</p>
                <p>{e.endDate}</p>
                <p>{e.status}</p>
              </div>
            ))
          }
          {/* <div className="flex bg-gray-500 p-5 rounded-xl">
              

          </div> */}

        </div>
        

      </div>
    </div>
  );
}
