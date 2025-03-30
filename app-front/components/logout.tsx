"use client";

import { deleteCookie } from "cookies-next";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Elimina el token de la cookie
    deleteCookie("access_token");

    // Muestra el toast de logout exitoso
    addToast({
      color: "success",
      title: "Logout Succesfull",
      description: "You have successfully logged out!",
    });

    // Redirige al login usando navegación del lado del cliente
    router.push("/login");
  };

  return (
    <Button color="danger" onClick={handleLogout}>
      Logout
    </Button>
  );
}
