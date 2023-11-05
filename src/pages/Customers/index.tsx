import { useEffect, useState, useRef, FormEvent } from "react";
import { ChevronLeftCircleIcon, SunMoon, Trash } from "lucide-react";
import { api } from "@/services/api";
import { useNavigate } from "react-router-dom";

interface CustomersProps {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
}

export function Customers() {
  const [dark, setDark] = useState(true);
  const [customers, setCustomers] = useState<CustomersProps[]>([]);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const response = await api.get("/customers");

    setCustomers(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!nameRef.current?.value || !emailRef.current?.value) {
      return;
    }

    const response = await api.post("/customer", {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
    });

    setCustomers((allCustomers) => [...allCustomers, response.data]);

    nameRef.current.value = "";
    emailRef.current.value = "";
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("/customer", {
        params: {
          id,
        },
      });

      const allCustomers = customers.filter((custumer) => custumer.id != id);

      setCustomers(allCustomers);
    } catch (error) {
      console.log(error);
    }
  }

  const navigate = useNavigate()

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
        <h1 className="text-4xl font-medium">Clientes</h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label htmlFor="name" className="font-medium">
            Nome:
          </label>
          <input
            type="text"
            id="name"
            ref={nameRef}
            placeholder="Digite o nome do cliente"
            className="w-full mb-5 p-2 bg-background rounded-lg border-2 border-green-500"
          />

          <label htmlFor="email" className="font-medium">
            E-mail:
          </label>
          <input
            type="text"
            id="email"
            ref={emailRef}
            placeholder="Digite o email do cliente"
            className="w-full mb-5 p-2 bg-background rounded-lg border-2 border-green-500"
          />

          <input
            type="submit"
            value="Cadastrar"
            className="cursor-pointer w-full p-2 bg-green-500 rounded-lg font-medium"
          />
        </form>

        <section className="flex flex-col space-y-6">
          {customers.length === 0 ? (
            <p className="text-2xl text-center">Sem clientes</p>
          ) : (
            customers.map((customer) => (
              <article
                key={customer.id}
                className="relative w-full bg-foreground text-background p-2 rounded-lg hover:scale-105 duration-200"
              >
                <p>
                  <span className="font-medium">Nome: </span>
                  {customer.name}
                </p>
                <p>
                  <span className="font-medium">Email: </span>
                  {customer.email}
                </p>
                <p>
                  <span className="font-medium">Status: </span>
                  {customer.status ? "Ativo" : "Desativado"}
                </p>

                <button
                  className="absolute right-0 -top-2 bg-red-600 p-2 rounded-lg"
                  onClick={() => handleDelete(customer.id)}
                >
                  <Trash size={18} color="#FFF" />
                </button>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
