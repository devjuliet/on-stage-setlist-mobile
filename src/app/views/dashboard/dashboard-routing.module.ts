import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'sets-lists',
        loadChildren: () => import('./playlist/playlist.module').then(m => m.PlaylistPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./options/options.module').then(m => m.OptionsPageModule)
      },
      {
        path: 'list/:idLiveEvent/:idSet',
        loadChildren: () => import('./songlist/songlist.module').then(m => m.SonglistPageModule)
      },
      {
        path: 'song/:idLiveEvent/:idSet/:idSong',
        loadChildren: () => import('./song/song.module').then(m => m.SongPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'song',
    loadChildren: () => import('./song/song.module').then( m => m.SongPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
