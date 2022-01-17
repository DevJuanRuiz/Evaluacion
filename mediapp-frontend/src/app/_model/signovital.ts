import { Paciente } from "./paciente";

export class SignoVital {
    idSignoVital: number;
    paciente: Paciente;
    fecha: string;
    temperatura: string;
    pulso: string;
    ritmo: string;
    email: string;
}