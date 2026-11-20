export interface Customer {
  id?: number;
  nombreEmpresa: string;
  paisDestino: string;
  personaContacto: string;
  email: string;
  telefono?: string;
  direccionFiscal?: string;
  activo?: boolean;
}
