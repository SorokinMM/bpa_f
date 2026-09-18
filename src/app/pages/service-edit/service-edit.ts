import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceItemService } from '../../services/service-item.service';
import { ServiceItemInterface } from '../../interfaces/service-item.interface';
import { SubserviceInterface } from '../../interfaces/subservice.interface';

@Component({
  selector: 'app-service-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './service-edit.html',
  styleUrl: './service-edit.scss',
})
export class ServiceEdit {
  @Input() isOpen = false;
  @Input() serviceId: string | null = null;
  @Output() closeRegisterForm = new EventEmitter<void>();
  private formBuilder = inject(FormBuilder);
  private serviceItemService = inject(ServiceItemService);
  private cdr = inject(ChangeDetectorRef);

  protected serviceItem: ServiceItemInterface | undefined;
  protected errorMessage: string | null = null;
  protected availableServices: ServiceItemInterface[] = [];
  protected showServiceDropdown = false;

  readonly serviceTypes: string[] = ['Service', 'Group of services'];

  protected serviceItemForm = this.formBuilder.nonNullable.group({
    id: [''],
    name: ['', Validators.required],
    shortName: ['', Validators.required],
    receiptName: ['', Validators.required],
    serviceType: ['', Validators.required],
    description: ['', Validators.required],
    subServiceItems: [Array<SubserviceInterface>()],
    duration: [0, Validators.required],
    findService: [''],
  });

  ngOnInit() {
    this.setupDynamicValidators();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isOpen && this.serviceId != null) {
      this.loadServiceData(this.serviceId);
      this.loadAvailableServices();
    } else if (this.isOpen && this.serviceId == null) {
      this.serviceItemForm.reset();
      this.loadAvailableServices();
    }
  }

  loadAvailableServices() {
    this.serviceItemService.getServiceList().subscribe({
      next: (services) => {
        this.availableServices = services;
      },
      error: (err) => {
        console.error('Failed to load services:', err);
      },
    });
  }

  loadServiceData(id: string) {
    this.serviceItemService.getServiceItem(id).subscribe({
      next: (result) => {
        this.serviceItem = result;

        console.log(this.serviceItem);

        this.serviceItemForm.patchValue(result);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err;
        this.cdr.markForCheck();
      },
    });
  }

  onSubmit() {
    console.log('Save service');

    if (this.serviceItemForm.valid) {
      if (this.serviceId == null) {
        this.serviceItemService.createService(this.serviceItemForm.getRawValue()).subscribe({
          next: () => {
            this.close();
          },
          error: (error) => {
            this.errorMessage = error;
            this.cdr.markForCheck();
          },
        });
      } else {
        this.serviceItemService.updateService(this.serviceId, this.serviceItemForm.getRawValue()).subscribe({
          next: () => {
            this.close();
          },
          error: (error) => {
            this.errorMessage = error;
            this.cdr.markForCheck();
          },
        })
      }
    } else {
      console.log('Service Item form does not valid');
    }
  }

  close() {
    this.closeRegisterForm.emit();
  }

  private setupDynamicValidators(): void {
    this.serviceItemForm.controls.serviceType.valueChanges.subscribe((type) => {
      const subServiceControl = this.serviceItemForm.controls.subServiceItems;

      if (type === 'Group of services') {
        subServiceControl.setValidators(Validators.required);
      } else {
        subServiceControl.clearValidators();
      }
    })
  }

  get filteredServices(): ServiceItemInterface[] {
    const searchTerm = this.serviceItemForm.controls.findService.value.toLowerCase();
    if (!searchTerm) {
      return this.availableServices;
    }
    return this.availableServices.filter(service =>
      service.name.toLowerCase().includes(searchTerm) ||
      service.shortName.toLowerCase().includes(searchTerm)
    );
  }

  onFindServiceFocus() {
    this.showServiceDropdown = true;
  }

  onFindServiceBlur() {
    setTimeout(() => {
      this.showServiceDropdown = false;
    }, 200);
  }

  selectService(service: ServiceItemInterface) {
    const currentSubservices = this.serviceItemForm.controls.subServiceItems.value || [];
    const exists = currentSubservices.some((s: SubserviceInterface) => s.id === service.id);

    if (!exists) {
      this.serviceItemForm.controls.subServiceItems.setValue([
        ...currentSubservices,
        { id: service.id, name: service.name }
      ]);
    }

    this.serviceItemForm.controls.findService.setValue('');
    this.showServiceDropdown = false;
  }

  removeSubservice(subservice: SubserviceInterface) {
    const currentSubservices = this.serviceItemForm.controls.subServiceItems.value || [];
    this.serviceItemForm.controls.subServiceItems.setValue(
      currentSubservices.filter((s: SubserviceInterface) => s.id !== subservice.id)
    );
  }
}
