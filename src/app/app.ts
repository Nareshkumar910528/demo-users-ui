import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout } from "./shared";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Layout],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}
