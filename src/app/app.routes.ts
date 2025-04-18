import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        canActivate: [publicGuard],
        loadChildren: () =>
            import('./core/layout/public/public.module').then(m => m.PublicModule)
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        loadChildren: () =>
            import('./core/layout/private/private.module').then(m => m.PrivateModule)
    },
    {
        path: '**',
        component: NotFoundComponent
    },
    {
        path: 'not-found',
        component: NotFoundComponent
    }
];
