import { Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { MapaComponent } from './componentes/mapa/mapa.component';


export const routes: Routes = [
    {path:'', component: LoginComponent},
    {path:'home', component: MapaComponent},
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
