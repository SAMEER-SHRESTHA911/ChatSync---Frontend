import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { ROUTE_CONSTANT } from './core/constants/route.constants';

export const routes: Routes = [
    {
        path: '',
        canActivate: [publicGuard],
        loadChildren: () =>
            import('./core/layout/public/public.module').then(m => m.PublicModule)
    },
    {
        path: ROUTE_CONSTANT.home,
        canActivate: [authGuard],
        loadChildren: () =>
            import('./core/layout/private/private.module').then(m => m.PrivateModule)
    },  
    {
        path: ROUTE_CONSTANT.error,
        component: NotFoundComponent
    },
    {
        path: ROUTE_CONSTANT.notFound,
        component: NotFoundComponent
    }
];
