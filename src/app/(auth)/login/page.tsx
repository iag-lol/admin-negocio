import { LoginForm } from "@/features/auth/components/login-form";
import { readSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await readSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase text-primary font-semibold">Acceso</p>
        <h1 className="text-2xl font-bold text-foreground">Panel Multi-local</h1>
        <p className="text-sm text-muted-foreground">Ingresa con tu RUT y contraseña entregada por RRHH.</p>
      </div>
      <LoginForm />
    </div>
  );
}
