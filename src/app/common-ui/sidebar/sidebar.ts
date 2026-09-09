import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private router = inject(Router);

  menuReferences = [
    {
      label: 'Services',
      link: '/service',
    },
    {
      label: 'Clients',
      link: '/client',
    },
  ];

  openLink(link: string) {
    this.router.navigate([link]);
  }
  protected readonly onclick = onclick;
}
