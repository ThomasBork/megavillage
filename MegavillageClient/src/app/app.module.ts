import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GameObjectComponent } from './game/game-object/game-object.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CreateUserComponent } from './user/create-user/create-user.component';
import { LogInComponent } from './user/log-in/log-in.component';
import { HudItemsComponent } from './game/hud/hud-items/hud-items.component';
import { HudItemComponent } from './game/hud/hud-items/hud-item/hud-item.component';
import { AnimationComponent } from './common/animation/animation.component';
import { PlayerComponent } from './game/game-object/player/player.component';
import { HudResourcesComponent } from './game/hud/hud-resources/hud-resources.component';
import { HudShopWindowComponent } from './game/hud/hud-shop-window/hud-shop-window.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    GameObjectComponent,
    CreateUserComponent,
    LogInComponent,
    HudItemsComponent,
    HudItemComponent,
    AnimationComponent,
    PlayerComponent,
    HudResourcesComponent,
    HudShopWindowComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
