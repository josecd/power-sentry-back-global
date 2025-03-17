import { User } from '../usuarios/entities/usuario.entity'; // Ajusta la ruta según tu proyecto

declare global {
  namespace Express {
    interface Request {
        user?: {
            sub: number; // ID del usuario
            email: string; // Email del usuario
            roles: string[]; // Roles del usuario
          };
    }
  }
}