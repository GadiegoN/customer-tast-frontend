import { Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { Customers } from "./pages/Customers";
import { Tasks } from "./pages/Tasks";

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/tasks" element={<Tasks />} />
        </Routes>
    )
}