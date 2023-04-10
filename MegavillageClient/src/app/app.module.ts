import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GameObjectComponent } from './game/game-object/game-object.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CreateUserComponent } from './user/create-user/create-user.component';
import { LogInComponent } from './user/log-in/log-in.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    GameObjectComponent,
    CreateUserComponent,
    LogInComponent
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
