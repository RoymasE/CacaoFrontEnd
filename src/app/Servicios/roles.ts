export type AppRole = 'ADMIN' | 'GERENTE' | 'JEFE_PLANTA' | 'ACOPIADOR' | 'VENDEDOR' | 'SUPERVISOR_CALIDAD';

const rolesByPage: Record<string, AppRole[]> = {
  resumen: ['ADMIN','GERENTE','JEFE_PLANTA','ACOPIADOR','VENDEDOR','SUPERVISOR_CALIDAD'],
  clientes: ['ADMIN','GERENTE','VENDEDOR'],
  productos: ['ADMIN','GERENTE','JEFE_PLANTA'],
  proveedores: ['ADMIN','GERENTE','ACOPIADOR'],
  usuarios: ['ADMIN','GERENTE'],
  lotes: ['ADMIN','GERENTE','JEFE_PLANTA','ACOPIADOR','SUPERVISOR_CALIDAD'],
  cajones: ['ADMIN','GERENTE','JEFE_PLANTA','ACOPIADOR','SUPERVISOR_CALIDAD'],
  fermentacion: ['ADMIN','GERENTE','JEFE_PLANTA','SUPERVISOR_CALIDAD'],
  secado: ['ADMIN','GERENTE','JEFE_PLANTA','SUPERVISOR_CALIDAD'],
  granos: ['ADMIN','GERENTE','JEFE_PLANTA'],
  derivados: ['ADMIN','GERENTE','JEFE_PLANTA'],
  pedidos: ['ADMIN','GERENTE','VENDEDOR'],
  packing: ['ADMIN','GERENTE','VENDEDOR'],
  areas: ['ADMIN','GERENTE'],
  balance: ['ADMIN','GERENTE','JEFE_PLANTA','SUPERVISOR_CALIDAD'],
};

export const ROLE_LABELS: Record<AppRole, string> = {
  ADMIN: 'Administrador', GERENTE: 'Gerencia', JEFE_PLANTA: 'Jefatura de planta',
  ACOPIADOR: 'Acopio', VENDEDOR: 'Ventas', SUPERVISOR_CALIDAD: 'Supervisión de calidad',
};

export function canAccessPage(page: string, role: string | null): boolean {
  return !!role && !!rolesByPage[page]?.includes(role as AppRole);
}

const writableRoles: Record<string, AppRole[]> = {
  clientes:['ADMIN','GERENTE','VENDEDOR'], proveedores:['ADMIN','GERENTE','ACOPIADOR'], usuarios:['ADMIN','GERENTE'],
  lotes:['ADMIN','GERENTE','JEFE_PLANTA','ACOPIADOR'], cajones:['ADMIN','GERENTE','JEFE_PLANTA'],
  fermentacion:['ADMIN','GERENTE','JEFE_PLANTA','SUPERVISOR_CALIDAD'], secado:['ADMIN','GERENTE','JEFE_PLANTA','SUPERVISOR_CALIDAD'],
  granos:['ADMIN','GERENTE','JEFE_PLANTA'], derivados:['ADMIN','GERENTE','JEFE_PLANTA'],
  pedidos:['ADMIN','GERENTE','VENDEDOR'], packing:['ADMIN','GERENTE','VENDEDOR'], areas:['ADMIN','GERENTE'],
};

export function canWritePage(page: string, role: string | null): boolean {
  return !!role && !!writableRoles[page]?.includes(role as AppRole);
}
