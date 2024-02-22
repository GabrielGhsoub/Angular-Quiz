import { Routes } from '@angular/router';
import { UserDetailComponent } from './user-detail/user-detail.component';

export const routes: Routes = [
  { path: 'users/:id', component: UserDetailComponent, },
];
