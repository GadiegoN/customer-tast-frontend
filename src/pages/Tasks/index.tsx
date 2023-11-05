import { api } from "@/services/api";
import { SunMoon, ChevronLeftCircleIcon, Trash } from "lucide-react";
import { useState, useEffect, useRef, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface CustomersProps {
  id: string;
  name: string;
}

interface TasksProps {
  id: string;
	title: string;
	description?: string;
	created_at: string;
	customerId: string;
  completed: boolean;
}

export function Tasks() {
  const [dark, setDark] = useState(true);
  const [customers, setCustomers] = useState<CustomersProps[]>([]);
  const [tasks, setTasks] = useState<TasksProps[]>([]);

  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const customerIdRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    loadCustomers();
    loadTasks();
  }, []);

  async function loadCustomers() {
    const response = await api.get("/customers");

    setCustomers(response.data);
  }

  async function loadTasks() {
    const response = await api.get("/tasks");

    setTasks(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if(!titleRef.current?.value || !customerIdRef.current?.value) {
      return
    }
    
    const response = await api.post("/task", {
      title: titleRef.current?.value,
      description: descriptionRef.current?.value,
      customerId: customerIdRef.current?.value,
    })

    setTasks((allTasks) => [...allTasks, response.data])

    titleRef.current.value = ""
    //descriptionRef.current.value = ""
    customerIdRef.current.value = "" 
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("/task", {
        params: {
          id
        }
      })

      const allTasks = tasks.filter((task) => task.id != id)

      setTasks(allTasks)

    } catch (error) {
      console.log(error)
    }
  }

  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex justify-center px-4">
      <button className="fixed right-5 top-5" onClick={() => setDark(!dark)}>
        <SunMoon />
      </button>

      <button
        className="absolute left-5 top-5 flex gap-2 items-center justify-center hover:border-2 hover:border-green-500 rounded-lg p-2"
        onClick={() => navigate("/")}
      >
        <ChevronLeftCircleIcon /> <span>Voltar</span>
      </button>

      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium">Tarefas</h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label htmlFor="title">Titulo:</label>
          <input 
            ref={titleRef}
            type="text"
            id="title"
            placeholder="Titulo da tarefa"
            className="w-full mb-5 p-2 bg-background rounded-lg border-2 border-green-500"
          />

          <label htmlFor="description">Descrição:</label>
          <input
            ref={descriptionRef}
            type="text"
            id="description"
            placeholder="Descrição da tarefa"
            className="w-full mb-5 p-2 bg-background rounded-lg border-2 border-green-500"
          />

          <label htmlFor="select">Cliente:</label>
          <select id="select" ref={customerIdRef} className="w-full bg-background h-10 border-2 border-green-600 rounded-lg p-2">
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id} className="">{customer.name}</option>
            ))}
          </select>

          <input
            type="submit"
            value="Cadastrar"
            className="cursor-pointer mt-5 w-full p-2 bg-green-500 rounded-lg font-medium"
          />
        </form>

        <section className="flex flex-col space-y-6">
              {
                tasks.length === 0 ? (
                  <p className="text-2xl text-center">Sem tarefas!</p>
                ) : (
                    tasks.map((task) => (
                      <article key={task.id} className="relative w-full bg-foreground text-background p-2 rounded-lg hover:scale-105 duration-200">
                        <p>
                          <span className="font-medium">Responsavel: </span>
                          {customers.map((customer) => (
                            customer.id === task.customerId && customer.name 
                          ))}
                        </p>
                        <p>
                          <span className="font-medium">Titulo: </span>
                          {task.title}
                        </p>
                        <p>
                          <span className="font-medium">Descrição: </span>
                          {task.description}
                        </p>
                        <div className={task.completed === true ? "bg-green-600 h-2 w-2 rounded-full" : "bg-red-600 h-2 w-2 rounded-full"}></div>

                        <button
                          className="absolute right-0 -top-2 bg-red-600 p-2 rounded-lg"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Trash size={18} color="#FFF" />
                        </button>
                      </article>
                    )) 
                )
              }
        </section>
      </main>

    </div>
  );
}
