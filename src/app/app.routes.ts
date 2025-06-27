import { Routes } from '@angular/router';
import { AuthGuard } from './data/auth/auth.guard';
import { RedirectComponent } from './data/redirect/redirect/redirect.component';

export const routes: Routes = [
    {path: '', component: RedirectComponent},
    {path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)},
    {path: 'home', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
        canActivate: [AuthGuard],
        data: { roles: ['admin', 'operator']}
    },
    {path: 'asset-management', loadChildren: () => import('./modules/asset-management/asset-management.module').then(m => m.AssetManagementModule),
        canActivate: [AuthGuard],
        data: { roles: ['admin', 'operator']}
    },
    {path: 'users-management', loadChildren: () => import('./modules/users-management/users-management.module').then(m => m.UsersManagementModule),
        canActivate: [AuthGuard],
        data: { roles: ['admin', 'operator']}
    },
    {path: 'reports', loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule),
        canActivate: [AuthGuard],
        data: { roles: ['admin', 'operator']}
    },
    {path: 'sa', loadChildren: () => import('./modules/superadmin/superadmin.module').then(m => m.SuperadminModule),
        canActivate: [AuthGuard],
        data: { roles: ['superadmin']}
    },
];
