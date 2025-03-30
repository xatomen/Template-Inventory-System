
"use client";

import { siteConfig } from "@/config/site";

import { Link } from "@heroui/link";
import { setCookie, getCookie } from "cookies-next";
import { get } from "http";

import { Listbox, ListboxSection, ListboxItem } from "@heroui/react";
import {Card, CardHeader, CardBody, CardFooter} from "@heroui/react";
import { Divider } from "@heroui/react";
import {Calendar} from "@heroui/react";

import {User} from "@heroui/react";
import {Avatar, AvatarGroup, AvatarIcon} from "@heroui/avatar";

import { useEffect, useState } from "react";

// Función que obtiene el token de la cookie y consulta a la API para verificar si el usuario es administrador
async function isAdmin(token: string | null): Promise<boolean> {
    if (!token) return false; // Si no hay token, el usuario no es administrador

    try {
        const response = await fetch("http://localhost:8000/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.is_admin; // Devuelve true si el usuario es administrador
        } else {
            console.error("Error al verificar el rol del usuario:", response.statusText);
            return false;
        }
    } catch (error) {
        console.error("Error de red:", error);
        return false;
    }
}

async function getUser(token: string | null): Promise<{ name: string, lastname: string, email: string }> {
    if (!token) return { name: "", lastname: "", email:"" }; // Si no hay token, devuelve un objeto vacío

    try {
        const response = await fetch("http://localhost:8000/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return { name: data.name, lastname: data.lastname, email: data.email }; // Devuelve el nombre y apellido del usuario
        } else {
            console.error("Error al obtener el usuario:", response.statusText);
            return { name: "", lastname: "", email:"" };
        }
    } catch (error) {
        console.error("Error de red:", error);
        return { name: "", lastname: "", email:"" };
    }
}

export default function Sidebar() {

    const [user, setUser] = useState<{ name: string; lastname: string; email: string }>({
        name: "",
        lastname: "",
        email: "",
    });
    const [isAdminUser, setIsAdminUser] = useState(false);

    useEffect(() => {
        const token = getCookie("access_token") as string | null;

        // Llama a las funciones asíncronas para obtener los datos del usuario y el rol
        async function fetchData() {
            const userData = await getUser(token);
            const adminStatus = await isAdmin(token);

            setUser(userData);
            setIsAdminUser(adminStatus);
        }

        fetchData();
    }, []);

    return (
        <aside className="p-4">
            <Card className="p-4">
                <User
                    name={user.name + " " + user.lastname}
                    description={user.email}
                    className="flex flex-col items-center justify-center mb-4"
                />
                <Divider />
                <Listbox>
                    <ListboxSection className="text-sm font-semibold text-default-500">
                        {/* Si es administrador que muestre el listado siteConfig.isAdmin */}
                        {isAdminUser ? siteConfig.adminItems.map((item) => (
                            <ListboxItem key={item.label} className="flex items-center gap-2">
                                <Link href={item.href} className="flex items-center gap-2" color="foreground">
                                    {item.label}
                                </Link>
                            </ListboxItem>
                        )) : siteConfig.userItems.map((item) => (
                            <ListboxItem key={item.label} className="flex items-center gap-2">
                                <Link href={item.href} className="flex items-center gap-2" color="foreground">
                                    {item.label}
                                </Link>
                            </ListboxItem>
                        ))}
                    </ListboxSection>
                </Listbox>
                <Divider />

            </Card>
        </aside>
    );

}