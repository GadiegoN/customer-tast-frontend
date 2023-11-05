import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function Layout() {
    const navigate = useNavigate()
    return (
        <div className="space-y-2 mx-10">
            <p className="text-3xl font-bold p-4">Layout</p>

            <button 
                className="bg-green-600 flex justify-center items-center gap-2 rounded-lg w-full text-lg font-medium p-2"
                onClick={() => navigate('/customers')}
            >
                <Plus />
                    Clientes
            </button>
            <button 
                className="bg-green-600 flex justify-center items-center gap-2 rounded-lg w-full text-lg font-medium p-2"
                onClick={() => navigate('/tasks')}
            >
                <Plus />
                    Tarefas
            </button>
        </div>
    )
}