import { Routes } from '@angular/router';
import { CustomerLayoutComponent } from './featured/customer/customer-layout/customer-layout.component';
import { HomeComponent } from './featured/customer/home/home.component';
import { NewsComponent } from './featured/customer/news/news.component';
import { ReviewsComponent } from './featured/customer/reviews/reviews.component';
import { ServicesComponent } from './featured/customer/services/services.component';
import { AboutComponent } from './featured/customer/about/about.component';
import { TicketLookupComponent } from './featured/customer/ticket-lookup/ticket-lookup.component';
import { InvoiceComponent } from './featured/customer/invoice/invoice.component';
import { ScheduleComponent } from './featured/customer/schedule/schedule.component';

export const routes: Routes = [
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'tin-tuc', component: NewsComponent },
      { path: 'danh-gia', component: ReviewsComponent },
      { path: 'dich-vu', component: ServicesComponent },
      { path: 'gioi-thieu', component: AboutComponent },
      { path: 'tra-cuu-ve', component: TicketLookupComponent },
      { path: 'hoa-don', component: InvoiceComponent },
      { path: 'lich-trinh', component: ScheduleComponent }
    ]
  }
];
