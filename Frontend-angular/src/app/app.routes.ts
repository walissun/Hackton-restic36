import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { LoginComponent } from './Pages/login/login.component';


export const routes: Routes = [
    {path:'', component: LoginComponent},
    {path:'home', component: HomeComponent}
];
