import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MegavillageClient';
  private ws?: WebSocket; 

  public connect() {
    this.ws = new WebSocket('ws://localhost:3000');
  
    this.ws.onopen = (event: Event) => {
      console.log('Connection was opened.');
      if (!this.ws) {
        console.log('Connection was aborted.');
        return;
      }

      this.ws.send('{"type":"joinGame", "message":{"playerName":"Thomas"}}');
    };
  
    this.ws.onmessage = (message: MessageEvent<string>) => {
      console.log('Message received:', message.data);
    };
  }
}
