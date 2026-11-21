import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Api } from '../../Servicios/api';
import { canAccessPage, ROLE_LABELS, AppRole } from '../../Servicios/roles';
import { Router, NavigationEnd } from '@angular/router';

export interface NavLink {
  page: string;
  path: string;
  label: string;
  icon?: string;
  desc?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  icon?: string;
  links: NavLink[];
}

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  activeDropdown: string | null = null;
  mobileMenuOpen = false;

  readonly groups: NavGroup[] = [
    {
      id: 'produccion',
      label: 'Producción',
      icon: 'spa',
      links: [
        { page: 'lotes', path: '/lotes', label: 'Cosecha de Lotes', icon: 'agriculture', desc: 'Recepción y registro de cacao baba' },
        { page: 'cajones', path: '/cajones', label: 'Cajones', icon: 'view_in_ar', desc: 'Capacidad y madera de fermentación' },
        { page: 'fermentacion', path: '/fermentacion', label: 'Fermentación', icon: 'thermostat', desc: 'Control de volteos y temperatura' },
        { page: 'secado', path: '/secado', label: 'Control de Secado', icon: 'wb_sunny', desc: 'Monitoreo de humedad y peso seco' },
      ],
    },
    {
      id: 'inventario',
      label: 'Inventario',
      icon: 'inventory_2',
      links: [
        { page: 'productos', path: '/productos', label: 'Visión General', icon: 'dashboard', desc: 'Resumen de stock y secciones' },
        { page: 'granos', path: '/granos', label: 'Granos Secos (Sec. 1)', icon: 'grain', desc: 'Pesajes y stock para exportación' },
        { page: 'derivados', path: '/derivados', label: 'Polvo y Manteca (Sec. 2)', icon: 'cookie', desc: 'Procesamiento, mermas y derivados' },
      ],
    },
    {
      id: 'comercial',
      label: 'Comercial',
      icon: 'storefront',
      links: [
        { page: 'clientes', path: '/clientes', label: 'Clientes', icon: 'corporate_fare', desc: 'Directorio de importadores' },
        { page: 'proveedores', path: '/proveedores', label: 'Proveedores', icon: 'handshake', desc: 'Agricultores y asociaciones comunales' },
        { page: 'pedidos', path: '/pedidos', label: 'Ventas y Pedidos', icon: 'receipt_long', desc: 'Contratos internacionales y reserva' },
        { page: 'packing', path: '/packing', label: 'Despachos (Packing)', icon: 'local_shipping', desc: 'Contenedores marítimos y sacos' },
      ],
    },
    {
      id: 'gestion',
      label: 'Gestión',
      icon: 'tune',
      links: [
        { page: 'balance', path: '/balance', label: 'Balance de Masas', icon: 'monitoring', desc: 'Flujo integral de materia prima' },
        { page: 'usuarios', path: '/usuarios', label: 'Usuarios y Roles', icon: 'manage_accounts', desc: 'Administración de cuentas y accesos' },
        { page: 'areas', path: '/areas', label: 'Áreas de Planta', icon: 'factory', desc: 'Infraestructura y responsables' },
      ],
    },
  ];

  constructor(private api: Api, private router: Router, private elRef: ElementRef) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeDropdown = null;
        this.mobileMenuOpen = false;
      }
    });
  }

  ngOnInit(): void {
    if (!localStorage.getItem('cacao_token')) return;
    this.api.get<any>('/auth/me').subscribe({
      next: user => {
        const name = [user.nombre, user.apellido].filter(Boolean).join(' ') || user.username;
        if (name) localStorage.setItem('cacao_nombre', name);
        if (user.rol) localStorage.setItem('cacao_rol', user.rol);
      },
      error: () => {},
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.activeDropdown = null;
    }
  }

  get username(): string {
    return localStorage.getItem('cacao_nombre') || '';
  }

  get role(): string {
    return localStorage.getItem('cacao_rol') || '';
  }

  get roleLabel(): string {
    return ROLE_LABELS[this.role as AppRole] || this.role || 'Usuario';
  }

  canSee(page: string): boolean {
    return !!this.username && canAccessPage(page, this.role);
  }

  toggleDropdown(groupId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === groupId ? null : groupId;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenus(): void {
    this.activeDropdown = null;
    this.mobileMenuOpen = false;
  }

  get visibleGroups(): NavGroup[] {
    if (!this.username) return [];
    return this.groups
      .map(group => ({
        ...group,
        links: group.links.filter(link => this.canSee(link.page)),
      }))
      .filter(group => group.links.length > 0);
  }

  isGroupActive(group: NavGroup): boolean {
    return group.links.some(link => this.router.isActive(link.path, { paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' }));
  }

  get initials(): string {
    return this.username
      .split(' ')
      .map(x => x[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'CP';
  }

  logout(): void {
    localStorage.removeItem('cacao_token');
    localStorage.removeItem('cacao_nombre');
    localStorage.removeItem('cacao_rol');
    this.router.navigateByUrl('/acceso');
  }
}
