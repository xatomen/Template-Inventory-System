import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token");
  console.log("Token:", token); // Imprime el token en la consola para depuración

  // Si el usuario ya está autenticado, redirige al dashboard desde /login
  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Si el usuario no está autenticado y accede a /dashboard, redirige al login
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Permite el acceso a otras rutas
  return NextResponse.next();
}

// Configura las rutas protegidas
export const config = {
  matcher: ["/login", "/dashboard/:path*"], // Protege /login y todas las subrutas de /dashboard
};