import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '', redirectTo: 'game', pathMatch: 'full'
    },
    { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
    { path: 'list', loadChildren: './pages/list/list.module#ListPageModule' },
    { path: 'game', loadChildren: './game/game.module#GamePageModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
