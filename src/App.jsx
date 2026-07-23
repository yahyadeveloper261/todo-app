
import { useEffect, useState } from "react";

export default function App() {
  // Input States
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filtercompleted, setFiltercompleted] = useState("all");
  const [duedate, setDuedate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filterpriority, setFilterpriority] = useState("all");
  const [sort,setSort]=useState("default");
  const [category,setCategory]=useState("work");
  const [filterCategory,setFilterCategory] = useState("all");
  
  const [dark,setDark]=useState(()=>{
try {
  
  return JSON.parse(localStorage.getItem("dark"))||false;
} catch {
  return false;
}

  });
  useEffect(()=>{try {
     localStorage.setItem("dark",JSON.stringify(dark))
  } catch{
  console.log("Dark mode save error");
  }},[dark])
  // Todos State (Load from LocalStorage)
  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("todos")) || [];
    } catch {
      return [];
    }
  });

  // Save Todos to LocalStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // ================= Enter Key =================
  const en = (e) => {
    if (e.key === "Enter") {
      add();
    }
  };

  // ================= CRUD Operations =================

  // Add / Update Todo
  const AddUpdate = () => {
   if (!input.trim()) {
  alert("Please enter a todo");
  return;
}

if (!duedate) {
  alert("Please select a due date");
  return;
}
    if (editId !== null) {
      setTodos((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
                ...item,
                name: input.trim(),
                date: duedate,
                priority: priority,
                category:category
              }
            : item
        )
      );

      setEditId(null);
    } else {
      setTodos((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: input.trim(),
          completed: false,
          date: duedate,
          priority: priority,
          category:category
        },
      ]);
    }

    setInput("");
    setDuedate("");
    setPriority("medium");
    setCategory("work")
  };

  // Edit Todo
  const edit = (id) => {
    const task = todos.find((item) => item.id === id);

    if (task) {
      setInput(task.name);
      setDuedate(task.date);
      setPriority(task.priority);
      setCategory(task.category)
      setEditId(id);
    }
  };

  // Delete Todo
  const del = (id) => {
    const ok = window.confirm("Delete this todo?");

    if (!ok) return;

    setTodos((prev) => prev.filter((item) => item.id !== id));
  };

  //Clear_all
  const ClearAll=()=>{
    const ok=window.confirm("Remove all todos?")
    if(ok){
      setTodos([])
     return
    }
    
  }
  ///clear marked
  const clearMarked=()=>{
    const ok=window.confirm("Remove all marked todos?")
    if(!ok) return;
      setTodos(prev=>prev.filter(item=>!item.completed))
    
  }
  // Toggle Completed
  const toggleCompleted = (id) => {
    setTodos((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  ///***************************Progess bar**************////
  const completed=todos.filter(prev=>prev.completed).length
  const total=todos.length;
  const progress=total===0?0:Math.round((completed/total)*100);
///**********************************Sorting */
const PriorityOrder={
  high:1,medium:2,low:3
}
const sortedTodos = [...todos].sort((a,b)=>{
  return sort === "default"
    ? 0
    : sort === "priority"
    ? PriorityOrder[a.priority] - PriorityOrder[b.priority]
    : new Date(a.date) - new Date(b.date)
})
////************************IsOverRide Date */

  ///////broswer Futures
  return(
<div
className={
dark
? "min-h-screen flex justify-center items-start pt-10 px-4 bg-slate-900 transition-colors duration-300"
: "min-h-screen flex justify-center items-start pt-10 px-4 bg-gray-100 transition-colors duration-300"
}
>
    <div
className={
dark
? "w-full max-w-xl bg-slate-800 p-6 rounded-2xl shadow-xl shadow-black/30 transition-all duration-300"
: "w-full max-w-xl bg-white p-6 rounded-2xl shadow-xl shadow-gray-300 transition-all duration-300"
}
>
  <h1
className={
dark
?"text-4xl font-extrabold text-center text-white mb-6 tracking-wide"
:"text-4xl font-extrabold text-center text-slate-800 mb-6 tracking-wide"
}
>
✨ Todo App
</h1>
<div className="flex justify-end mb-4">

<button
onClick={()=>setDark(!dark)}
className="
px-4 py-2
rounded-full
bg-slate-900
text-white
hover:scale-105
active:scale-95
transition
duration-200
dark:bg-white
dark:text-black
"
>
{dark?"☀️ Light":"🌙 Dark"}
</button>

</div>

<div className="flex gap-3 mt-5 flex-wrap">

  <button
    onClick={() => setFiltercompleted("all")}
    className="
      px-5 py-2
      rounded-full
      bg-blue-500
      text-white
      font-medium
      transition
      duration-200
      hover:bg-blue-600
      hover:scale-105
      active:scale-95
    "
  >
    All
  </button>

  <button
    onClick={() => setFiltercompleted("marked")}
    className="
      px-5 py-2
      rounded-full
      bg-green-500
      text-white
      font-medium
      transition
      duration-200
      hover:bg-green-600
      hover:scale-105
      active:scale-95
    "
  >
    Marked
  </button>

  <button
    onClick={() => setFiltercompleted("pending")}
    className="
      px-5 py-2
      rounded-full
      bg-gray-500
      text-white
      font-medium
      transition
      duration-200
      hover:bg-gray-600
      hover:scale-105
      active:scale-95
    "
  >
    Pending
  </button>

</div>
  

        {/* Todo Input */}
<div className="flex flex-col gap-4 mt-6">

  <input
    type="text"
    placeholder="Enter Todo"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={en}
    className={
      dark
        ? `
        w-full
        p-3
        rounded-lg
        border
        bg-slate-700
        text-white
        border-slate-600
        placeholder-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-amber-500
        transition
        duration-200
        `
        : `
        w-full
        p-3
        rounded-lg
        border
        bg-white
        text-gray-800
        border-gray-300
        placeholder-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        transition
        duration-200
        `
    }
  />


  {/* Date + Priority + Button */}
  <div className="flex flex-col sm:flex-row gap-3">

    <input
      type="date"
      value={duedate}
      onChange={(e) => setDuedate(e.target.value)}
      className="
      flex-1
      p-3
      rounded-lg
      border
      bg-white
      dark:bg-slate-700
      dark:text-white
      border-gray-300
      dark:border-slate-600
      "
    />


    <select
      value={priority}
      onChange={(e) => setPriority(e.target.value)}
      className="
      flex-1
      p-3
      rounded-lg
      border
      bg-white
      dark:bg-slate-700
      dark:text-white
      border-gray-300
      dark:border-slate-600
      "
    >
      <option value="medium">Medium</option>
      <option value="high">High</option>
      <option value="low">Low</option>
    </select>

<select value={category} onChange={(e)=>setCategory(e.target.value)}
    className="
      flex-1
      p-3
      rounded-lg
      border
      bg-white
      dark:bg-slate-700
      dark:text-white
      border-gray-300
      dark:border-slate-600
      ">
      <option value="work">Work</option>
      <option value="study" >Study</option>
      <option value="personal">Personal</option>
    </select>

    <button
      onClick={AddUpdate}
      className="
      px-6
      py-3
      rounded-lg
      bg-blue-500
      text-white
      font-semibold
      hover:bg-blue-600
      hover:scale-105
      active:scale-95
      transition
      duration-200
      "
    >
      {editId === null ? "Add" : "Update"}
    </button>

  </div>


  {/* Search + Priority Filter */}
  <div className="flex flex-col sm:flex-row gap-3">

    <input
      type="text"
      placeholder="Search Todo..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="
      flex-1
      p-3
      rounded-lg
      border
      bg-white
      dark:bg-slate-700
      dark:text-white
      border-gray-300
      dark:border-slate-600
      "
    />
             {/* sorted ui */}

    <select value={sort} onChange={(e)=>setSort(e.target.value)}
        className="
    flex-1
    min-w-0
    p-3
    rounded-lg
    border
    bg-white
    dark:bg-slate-700
    dark:text-white
    border-gray-300
    dark:border-slate-600
  ">
      <option value="default">Default</option>
      <option value="priority">Priority</option>
      <option value="duedate">Duedate</option>
    </select>

 

    <select
      value={filterpriority}
      onChange={(e) => setFilterpriority(e.target.value)}
       className="
    flex-1
    min-w-0
    p-3
    rounded-lg
    border
    bg-white
    dark:bg-slate-700
    dark:text-white
    border-gray-300
    dark:border-slate-600
  "
    >
      <option value="all">All Priority</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
      <option value="low">Low</option>
    </select>

  <select  className="
    flex-1
    min-w-0
    p-3
    rounded-lg
    border
    bg-white
    dark:bg-slate-700
    dark:text-white
    border-gray-300
    dark:border-slate-600
  "
  value={filterCategory}
  onChange={(e)=>setFilterCategory(e.target.value)}
>
  <option value="all">All Category</option>
  <option value="work">Work</option>
  <option value="study">Study</option>
  <option value="personal">Personal</option>
</select>
  </div>


{todos.length === 0 && (
  <p className="text-center text-gray-500 mt-5">
    No todos yet 🎯
  </p>
)}


<div className="mt-5">
 <div className="flex justify-between mb-2">
  <span className={dark?"text-white":"text-gray-800"}>Progress</span>
  <span className={dark?"text-white":"text-gray-800"}>
    {completed}/{total} ({progress}%)
    </span>
    </div>
    <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">

      <div className="h-3 bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }} >

      </div>
    </div>
 
</div>

  {/* Todo List */}
  <ul className="mt-5 space-y-3">

    {
      sortedTodos.filter(prev=>filterCategory==="all"?true:prev.category===filterCategory)
      .filter(prev =>
        filtercompleted === "all"
          ? true
          : filtercompleted === "marked"
          ? prev.completed
          : !prev.completed
      )
      .filter(prev =>
        filterpriority === "all"
          ? true
          : prev.priority === filterpriority
      )
      .filter(prev =>
        prev.name.toLowerCase().includes(search.toLowerCase())
      )
      .map((todo) => (

        <li
  key={todo.id}
  className={`
    flex
    flex-col
    sm:flex-row
    sm:items-center
    gap-3
    ${
      dark
        ? "bg-slate-700 text-white hover:bg-slate-600"
        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
    p-4
    rounded-xl
    transition
  `}
>
  <div className="flex items-center gap-3 w-full">
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={() => toggleCompleted(todo.id)}
      className="w-5 h-5 shrink-0"
    />
<span
className={`
flex-1 
font-medium 
break-word
${todo.completed ? "line-through opacity-50" : ""}
`}
>
      {todo.name} - {todo.date}
    </span>
  </div>

  <span
  className={
    todo.priority === "high"
      ? "text-red-500 font-bold"
      : todo.priority === "medium"
      ? "text-yellow-500 font-bold"
      : "text-green-500 font-bold"
  }
>
  {todo.priority}
</span>

<span
  className={
    todo.category === "work"
      ? "text-blue-500 font-bold"
      : todo.category === "study"
      ? "text-purple-500 font-bold"
      : "text-green-500 font-bold"
  }
>
  {todo.category}
</span>

  <div className="flex gap-2">
    <button
      onClick={() => edit(todo.id)}
      className="
        px-3 py-1
        rounded-lg
        bg-blue-500
        text-white
        hover:bg-blue-600
        transition
      "
    >
      Edit
    </button>

    <button
      onClick={() => del(todo.id)}
      className="
        px-3 py-1
        rounded-lg
        bg-red-500
        text-white
        hover:bg-red-600
        transition
      "
    >
      Delete
    </button>
  </div>
</li>

      ))
    }

  </ul>


  {/* Clear Button */}
  {
    todos.length >= 1 &&
    <button
      onClick={ClearAll}
      
      className="
      mt-5
      px-5
      py-2
      rounded-lg
      bg-red-600
      text-white
      hover:bg-red-700
      transition
      "
    >
      Clear All
    </button>
  }

  {
  todos.some(todo => todo.completed) &&
  <button
    onClick={clearMarked}
    className="
    mt-3
    px-5
    py-2
    rounded-lg
    bg-green-600
    text-white
    hover:bg-green-700
    transition
    "
  >
    Clear Marked
  </button>
}

</div>
      </div>
    </div>
  )
}