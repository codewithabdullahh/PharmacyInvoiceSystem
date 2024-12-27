import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isCondensed: boolean = false;

  designationName: any;
  roleName: any;
  isAdmin: any;
  userName: any;
  fullName: any;
  email: any;

  isSetupToggle: boolean = false;
  isAssignAreaToggle: boolean = false;
  isBulUtilizationToggle: boolean = false;
  isTaxSetupToggle: boolean = false;
  isLocalityFactorToggle: boolean = false;
  ispropSelectionToggle: boolean = false;
  isSmallFontChecked: boolean = true;
  currentYear: any;


  constructor(private router: Router) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    debugger;
    this.changeSidebar("dark");

    this.roleName = localStorage.getItem('roleName');
    this.designationName = localStorage.getItem('designationName');
    this.fullName = localStorage.getItem('name');
    this.userName = localStorage.getItem('userName');
    this.email = localStorage.getItem('email');
    this.isAdmin = localStorage.getItem('isAdmin');
    debugger;
  }
  userMenu: boolean = false;
  changeSidebar(value: string) {
    switch (value) {
      case "light":
        document.body.setAttribute('data-sidebar', 'light');
        document.body.setAttribute('data-topbar', 'dark');
        document.body.removeAttribute('data-sidebar-size');
        document.body.removeAttribute('data-layout-size');
        document.body.removeAttribute('data-keep-enlarged');
        document.body.classList.remove('vertical-collpsed');
        document.body.removeAttribute('data-layout-scrollable');
        break;
      case "compact":
        document.body.setAttribute('data-sidebar-size', 'small');
        document.body.setAttribute('data-sidebar', 'dark');
        document.body.removeAttribute('data-topbar');
        document.body.removeAttribute('data-layout-size');
        document.body.removeAttribute('data-keep-enlarged');
        document.body.classList.remove('sidebar-enable');
        document.body.classList.remove('vertical-collpsed');
        document.body.removeAttribute('data-layout-scrollable');
        break;
      case "dark":
        document.body.setAttribute('data-sidebar', 'dark');
        break;
      case "icon":
        document.body.classList.add('vertical-collpsed');
        document.body.setAttribute('data-sidebar', 'dark');
        document.body.removeAttribute('data-layout-size');
        document.body.setAttribute('data-keep-enlarged', "true");
        document.body.removeAttribute('data-topbar');
        document.body.removeAttribute('data-layout-scrollable');
        break;
      case "colored":
        document.body.classList.remove('sidebar-enable');
        document.body.classList.remove('vertical-collpsed');
        document.body.setAttribute('data-sidebar', 'colored');
        document.body.removeAttribute('data-layout-size');
        document.body.removeAttribute('data-keep-enlarged');
        document.body.removeAttribute('data-topbar');
        document.body.removeAttribute('data-layout-scrollable');
        document.body.removeAttribute('data-sidebar-size');
        break;
      default:
        document.body.setAttribute('data-sidebar', 'dark');
        break;
    }
  }
  onToggleMobileMenu() {
    this.isCondensed = !this.isCondensed;
    if (this.isCondensed == true) {
      document.body.classList.add('sidebar-enable');
      document.body.classList.add('vertical-collpsed');
    }
    else {
      document.body.classList.remove('sidebar-enable');
      document.body.classList.remove('vertical-collpsed');
    }
  }
  logout() {
    this.router.navigate(['/login']);
  }

  toggleMenu(): void {
    this.isAssignAreaToggle = false;
    this.isSetupToggle = false;
    this.isTaxSetupToggle = false;
    this.isBulUtilizationToggle = false;
    this.ispropSelectionToggle = false;
    this.isLocalityFactorToggle = false;
  }

  isSetupActive(): boolean {
    return this.router.isActive('admin/setup', false); // Check if /about is the active route
  }
  isAssignAreaActive(): boolean {
    return this.router.isActive('admin/assignArea', false); // Check if /about is the active route
  }
  isTaxSetupActive(): boolean {
    return this.router.isActive('admin/calculationTax', false); // Check if /about is the active route
  }
  isBulUtilizationActive(): boolean {
    return this.router.isActive('admin/buildingUtilization', false); // Check if /about is the active route
  }
  isPropertySelectionActive(): boolean {
    return this.router.isActive('admin/propertSelection', false); // Check if /about is the active route
  }
  isLocalityFactorActive(): boolean {
    return this.router.isActive('admin/localityfactor', false); // Check if /about is the active route
  }

  toggleFont() {
    this.isSmallFontChecked = !this.isSmallFontChecked;
  }
}
