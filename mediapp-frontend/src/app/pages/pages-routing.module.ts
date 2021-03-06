import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../_service/guard.service';
import { BuscarComponent } from './buscar/buscar.component';
import { ConsultaEspecialComponent } from './consulta-especial/consulta-especial.component';
import { ConsultaWizardComponent } from './consulta-wizard/consulta-wizard.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { EspecialidadEdicionComponent } from './especialidad/especialidad-edicion/especialidad-edicion.component';
import { EspecialidadComponent } from './especialidad/especialidad.component';
import { ExamenEdicionComponent } from './examen/examen-edicion/examen-edicion.component';
import { ExamenComponent } from './examen/examen.component';
import { InicioComponent } from './inicio/inicio.component';
import { MedicoComponent } from './medico/medico.component'
import { MenuRolAsignarComponent } from './menu-rol/menu-rol-asignar/menu-rol-asignar.component';
import { MenuRolComponent } from './menu-rol/menu-rol.component';
import { MenuEdicionComponent } from './menu/menu-edicion/menu-edicion.component';
import { MenuComponent } from './menu/menu.component';
import { Not403Component } from './not403/not403.component';
import { PacienteEdicionComponent } from './paciente/paciente-edicion/paciente-edicion.component';
import { PacienteComponent } from './paciente/paciente.component';
import { ReporteComponent } from './reporte/reporte.component';
import { RolEdicionComponent } from './rol/rol-edicion/rol-edicion.component';
import { RolComponent } from './rol/rol.component';
import { SignoVitalEdicionComponent } from './signo-vital/signo-vital-edicion/signo-vital-edicion.component';
import { SignoVitalComponent } from './signo-vital/signo-vital.component';
import { UsuarioRolAsignarComponent } from './usuario-rol/usuario-rol-asignar/usuario-rol-asignar.component';
import { UsuarioRolComponent } from './usuario-rol/usuario-rol.component';


export const routes: Routes = [
    { path: 'inicio', component: InicioComponent, canActivate: [GuardService]},
    {
        path: 'paciente', component: PacienteComponent, children: [
            { path: 'nuevo', component: PacienteEdicionComponent },
            { path: 'edicion/:id', component: PacienteEdicionComponent }
        ], canActivate: [GuardService]
    },
    {
        path: 'examen', component: ExamenComponent, children: [
            { path: 'nuevo', component: ExamenEdicionComponent },
            { path: 'edicion/:id', component: ExamenEdicionComponent }
        ], canActivate: [GuardService]
    },
    {
        path: 'especialidad', component: EspecialidadComponent, children: [
            { path: 'nuevo', component: EspecialidadEdicionComponent },
            { path: 'edicion/:id', component: EspecialidadEdicionComponent }
        ], canActivate: [GuardService]
    },
    { path: 'medico', component: MedicoComponent, canActivate: [GuardService]},
    { path: 'consulta', component: ConsultaComponent, canActivate: [GuardService]},
    { path: 'consulta-wizard', component: ConsultaWizardComponent, canActivate: [GuardService]},
    { path: 'consulta-especial', component: ConsultaEspecialComponent, canActivate: [GuardService]},
    { path: 'buscar', component: BuscarComponent, canActivate: [GuardService]},
    { path: 'reporte', component: ReporteComponent, canActivate: [GuardService]},
    { path: 'not-403', component: Not403Component},
    {
        path: 'signo-vital', component: SignoVitalComponent, children: [
            { path: 'nuevo', component: SignoVitalEdicionComponent },
            { path: 'edicion/:id', component: SignoVitalEdicionComponent }
        ], canActivate: [GuardService]
    },
    {
        path: 'rol', component: RolComponent, children: [
            { path: 'nuevo', component: RolEdicionComponent },
            { path: 'edicion/:id', component: RolEdicionComponent }
        ], canActivate: [GuardService]
    },
    {
        path: 'menu', component: MenuComponent, children: [
            { path: 'nuevo', component: MenuEdicionComponent },
            { path: 'edicion/:id', component: MenuEdicionComponent }
        ], canActivate: [GuardService]
    },
    {
        path: 'usuario-rol', component: UsuarioRolComponent, children: [
            { path: 'asignar/:id', component: UsuarioRolAsignarComponent }
        ], canActivate: [GuardService]
    },
    {
        path: 'menu-rol', component: MenuRolComponent, children: [
            { path: 'asignar/:id', component: MenuRolAsignarComponent }
        ], canActivate: [GuardService]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }