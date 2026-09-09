import { SubserviceInterface } from './subservice.interface';

export interface ServiceItemInterface {
  id: string;
  name: string;
  shortName: string;
  receiptName: string;
  serviceType: string;
  description: string;
  subServiceItems: SubserviceInterface[];
  duration: number;
}
