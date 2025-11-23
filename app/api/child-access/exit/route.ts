import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  
  // Remove o cookie que indica acesso à criança (ajuste o nome se for diferente)
  const response = NextResponse.json({ success: true });
  response.cookies.set("childId", "", { maxAge: 0, path: "/", httpOnly: true });

  return response;
}