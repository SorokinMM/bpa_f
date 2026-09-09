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
  });

  ngOnInit() {
    this.setupDynamicValidators();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isOpen && this.serviceId != null) {
      this.loadServiceData(this.serviceId);
    } else if (this.isOpen && this.serviceId == null) {
      this.serviceItemForm.reset();
    }
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
    console.log('Service Item form validation: ' + this.serviceItemForm.valid);
    console.log(this.serviceItemForm);

    if (this.serviceItemForm.valid) {
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
}
