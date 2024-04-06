import { Routes } from '@angular/router';
import { SearchformComponent } from './searchform/searchform.component';
import { ResultformComponent } from './resultform/resultform.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

export const routes: Routes = [
    { path: '', redirectTo: '/search/home', pathMatch: 'full' }, // Redirect from empty path to /search/home
    { path: 'search/home', component: SearchformComponent }, 
    {
        path:'search/:id',
        component: ResultformComponent,
    },
        {
            path: 'watchlist',
            component: WatchlistComponent
        },

        {
            path: 'portfolio',
            component: PortfolioComponent
        }


];
