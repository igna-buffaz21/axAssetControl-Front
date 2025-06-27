import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { GeneralReportComponent } from './general-report/general-report.component';
import { MissingAssetsComponent } from './missing-assets/missing-assets.component';
import { AuditLogComponent } from './audit-log/audit-log.component';

const routes: Routes = [
  {path: '', component: MenuComponent},
  {path: 'menu', component: MenuComponent},
  {path: 'general-reports', component: GeneralReportComponent}, //ruta para cargar el ultimo detalle
  {path: 'general-reports/:id', component: GeneralReportComponent}, //ruta para cargar un detalle especifico
  {path: 'missing-assets', component: MissingAssetsComponent},
  {path: 'audit-log', component: AuditLogComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
