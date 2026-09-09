import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceListInterface } from '../interfaces/service-list.interface';
import { catchError, tap, throwError } from 'rxjs';
import { ServiceItemInterface } from '../interfaces/service-item.interface';

@Injectable({
  providedIn: 'root',
})
export class ServiceItemService {
  private http = inject(HttpClient);
  private path = 'http://localhost:8080/bpa/v1/service/';

  getServiceList() {
    return this.http.get<ServiceListInterface[]>(`${this.path}service-list`);
  }

  getServiceItem(id: string) {
    return this.http.get<ServiceItemInterface>(`${this.path}${id}`).pipe(
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  createService(item: ServiceItemInterface) {
    console.log('Create service:');
    console.log(item);
    return this.http.post<ServiceItemInterface>(`${this.path}create`, item).pipe(
      catchError((error) => {
          return throwError(error.error.message);
      })
    )
  }
}
