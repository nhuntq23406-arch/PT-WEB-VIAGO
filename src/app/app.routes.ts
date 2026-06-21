import { Routes } from '@angular/router';
import { HomeComponent } from './featured/customer/home/home.component';
import { TicketLookupComponent } from './featured/customer/ticket-lookup/ticket-lookup.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tra-cuu-ve', component: TicketLookupComponent }
];

