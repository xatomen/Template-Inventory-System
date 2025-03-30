"use client";

import { setCookie } from "cookies-next";
import { Button } from "@heroui/react";

// Botón logout
export default function LogoutButton() {
    const handleLogout = () => {
        // Elimina el token de la cookie
        setCookie("access_token", "", { maxAge: -1 });
        window.location.href = "/login"; // Redirige a la página de inicio de sesión
    };

    return (
        <Button color="danger" onClick={handleLogout}>Logout</Button>
    );
}
