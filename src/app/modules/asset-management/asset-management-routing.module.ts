import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationsComponent } from './components/locations/locations.component';
import { SectorsComponent } from './components/sectors/sectors.component';
import { SubsectorsComponent } from './components/subsectors/subsectors.component';
import { AssetsComponent } from './components/assets/assets.component';
import { AddLocationComponent } from './components/add-location/add-location.component';
import { AddSectorComponent } from './components/add-sector/add-sector.component';
import { AddSubsectorComponent } from './components/add-subsector/add-subsector.component';
import { AddAssetComponent } from './components/add-asset/add-asset.component';
import { AuthGuard } from '../../data/auth/auth.guard';

const routes: Routes = [
  {path: 'locations', component: LocationsComponent},
  {path: 'sector/:id', component: SectorsComponent},
  {path: 'subsector/:id', component: SubsectorsComponent},
  {path: 'assets/:id', component: AssetsComponent},
  {path: 'add-location', component: AddLocationComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'operator']}},
  {path: 'add-sector', component: AddSectorComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'operator']}},
  {path: 'add-subsector', component: AddSubsectorComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'operator']}},
  {path: 'add-asset', component: AddAssetComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'operator']}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetManagementRoutingModule { }
