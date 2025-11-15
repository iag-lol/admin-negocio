import { z } from "zod";

export const loginSchema = z.object({
  rut: z.string().min(7, "Ingresa un RUT válido"),
  password: z.string().min(4, "Contraseña requerida"),
});

export type LoginValues = z.infer<typeof loginSchema>;
