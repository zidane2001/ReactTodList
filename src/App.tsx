import { useEffect, useState } from 'react'
import TodoItem from './TodoItem';
import { Construction, EyeClosed } from 'lucide-react';


type Priority = "Urgente" | "Moyenne" | "Basse"
type Todo = {
  id: number;
  text: string;
  priority: Priority;
}


function App() {

  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("Moyenne");

  // enregistrer les Todos dans le Local Storage
  const saveTodos = localStorage.getItem("todos");
  const initialTodos = saveTodos ? JSON.parse(saveTodos) : [];

  // Une liste de tâches
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  //compter les occurences de chaque tâches
  const [filter, setFilter] = useState<Priority | "Toutes">("Toutes")

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos])

  const UrgenteCounter = todos.filter((todo) => todo.priority === "Urgente").length;
  const MoyenneCounter = todos.filter((todo) => todo.priority === "Moyenne").length;
  const BasseCounter = todos.filter((todo) => todo.priority === "Basse").length;
  const TotalCounter = todos.length;

  // Ajout de la fonctions de suppression de todo
  function deleteTodo(id: number) {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  }

  function addTodo() {
    if (input.trim() === "") return

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority
    }

    //ajouter le todo dans la liste
    const newTodos = ([...todos, newTodo])
    setTodos(newTodos)
    setInput("")
    setPriority("Moyenne")
    console.log(newTodos)
  }

  // filtreed todo 
  let filteredTodos: Todo[] = []
  if (filter === "Toutes") {
    filteredTodos = todos
  } else {
    filteredTodos = todos.filter((todo) => todo.priority === filter)
  }

  // stcker les id des elements selectionnés
  const [selectedTodos, setSelecTodos] = useState<Set<number>>(new Set());

  const toggleSelecteTodo = (id: number) => {
    const newSelectedTodos = new Set(selectedTodos);
    if (newSelectedTodos.has(id)) {
      newSelectedTodos.delete(id);
    } else {
      newSelectedTodos.add(id);
    }
    setSelecTodos(newSelectedTodos);
  };

  function finishedSelected() {
    const newTodos = todos.filter((todo) => {
      if (selectedTodos.has(todo.id)) {
    
      return false
    
    } else {
      return true;
    }
    });
  
      setTodos(newTodos);
    setSelecTodos(new Set());
    
}





  return (
    <div className="flex justify-center items-center ">
      <div className="w-2/3 flex-col space-y-4 gap-4 my-15 bg-base-300 p-5 rounded-2xl">
        <div className="flex justify-around mb-4">
          <div className="stat">
            <div className="stat-title">Toutes les tâches</div>
            <div className="stat-value">{TotalCounter}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Urgente</div>
            <div className="stat-value text-red-500">{UrgenteCounter}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Moyenne</div>
            <div className="stat-value text-yellow-500">{MoyenneCounter}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Basse</div>
            <div className="stat-value text-green-500">{BasseCounter}</div>
          </div>
        </div>
        <div className='flex gap-4'>
          <input
            type="text"
            className='input w-full'
            placeholder="Ajouter une tâche..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <select
            className='select w-full bg-base-100'
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option >

          </select>
          <button onClick={addTodo} className='btn btn-primary'>
            Ajouter
          </button>
        </div>
        <div className='space-y-2 flex-1 h-fit'>

          <div className='flex justify-between items-center'>
            <div className='flex flex-wrap gap-4'>
              <button
                className={`btn btn-soft ${filter === "Toutes" ? "btn-primary " : ""}`} onClick={() => setFilter("Toutes")}>
                Tous ({TotalCounter})
              </button>
              <button
                className={`btn btn-soft ${filter === "Urgente" ? "btn-primary " : ""}`} onClick={() => setFilter("Urgente")}>
                Urgente ({UrgenteCounter})
              </button>

              <button
                className={`btn btn-soft ${filter === "Moyenne" ? "btn-primary " : ""}`} onClick={() => setFilter("Moyenne")}>
                Moyenne ({MoyenneCounter})
              </button>

              <button
                className={`btn btn-soft ${filter === "Basse" ? "btn-primary " : ""}`} onClick={() => setFilter("Basse")}>
                Basse ({BasseCounter})
              </button>

            </div>
            <button onClick={finishedSelected}
              className='btn btn-soft btn-error'
              disabled={selectedTodos.size === 0}
            >
              
              Finir la Selection {selectedTodos.size > 0 ? `(${selectedTodos.size})` : ""}

            </button>

          </div>


          {filteredTodos.length > 0 ? (
            <ul className='divide-y divide-primary/20'>
              {filteredTodos.map((todo) => (
                <li key={todo.id}>
                  <TodoItem todo={todo}
                    isSelected={selectedTodos.has(todo.id)}
                    onDelete={() => deleteTodo(todo.id)}
                    onToggleSelect={toggleSelecteTodo}
                  />
                </li>
              ))}
            </ul>
          ) : (

            <div className="flex flex-col justify-center items-center flex-col p-5">
              <div>
                <Construction strokeWidth={1} className='w-40 h-40 text-primary' />

                <p className='text-sm text-primary/50'>
                  aucune tâche pour ce filtre
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

