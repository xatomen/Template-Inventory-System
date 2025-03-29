"use client";

import React from "react";
import { Button, Input, Checkbox, Link, Form } from "@heroui/react";
import { Icon } from "@iconify/react";
import { setCookie, getCookie } from "cookies-next";

import { useRouter } from "next/navigation";

export default function LoginComponent() {

  const router = useRouter();

  const [isVisible, setIsVisible] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);

  const toggleVisibility = () => setIsVisible(!isVisible);

  React.useEffect(() => {
    // Obtén el token desde la cookie
    const storedToken = getCookie("access_token");
    setToken(storedToken as string); // Actualiza el estado con el token
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: "",
      lastname: "",
      email: formData.get("email"),
      password_hash: formData.get("password"),
    };

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        const token = result.token;

        // Guarda el token en una cookie
        setCookie("access_token", token, {
          maxAge: 60 * 60 * 24, // 1 día
          path: "/", // Asegúrate de que la cookie esté disponible en toda la aplicación
        });

        alert("Login successful");

        router.push("/dashboard"); // Redirige a la página de inicio después de iniciar sesión

      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div>
        {/* Mostrar el token guardado en la cookie */}
        {token ? (
          <p className="text-center text-small">Token: {token}</p>
        ) : (
          <p className="text-center text-small">No token found</p>
        )}
      </div>
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <p className="pb-4 text-left text-3xl font-semibold">
          Log In
          <span aria-label="emoji" className="ml-2" role="img">
            👋
          </span>
        </p>
        <Form
          className="flex flex-col gap-4"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            isRequired
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Password"
            labelPlacement="outside"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
          />
          <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox defaultSelected name="remember" size="sm">
              Remember me
            </Checkbox>
            <Link className="text-default-500" href="#" size="sm">
              Forgot password?
            </Link>
          </div>
          <Button className="w-full" color="primary" type="submit">
            Log In
          </Button>
        </Form>
        <p className="text-center text-small">
          <Link href="#" size="sm">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
