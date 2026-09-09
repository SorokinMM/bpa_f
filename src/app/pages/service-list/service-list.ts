import { Component, inject, SimpleChanges } from '@angular/core';
import { ServiceItemService } from '../../services/service-item.service';
import { ServiceListInterface } from '../../interfaces/service-list.interface';
import { ServiceEdit } from '../service-edit/service-edit';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-service-list',
  imports: [ServiceEdit, AsyncPipe],
  templateUrl: './service-list.html',
  styleUrl: './service-list.scss',
})
export class ServiceList {
  private serviceItemService = inject(ServiceItemService);
  protected services$ = this.serviceItemService.getServiceList();
  protected isEditFormOpen = false;
  protected editServiceId: string | null = null;

  editElementOpenModal(id: string | null) {
    this.isEditFormOpen = true;
    this.editServiceId = id;
  }
}
