import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { ApiClientService } from "./service/api-client.service";
import { HttpClientModule } from "@angular/common/http";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";   // ✅ correction ici
import { ProgressBarModule } from "primeng/progressbar";
import { catchError, EMPTY } from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HttpClientModule, InputTextModule, ButtonModule, ProgressBarModule], // ✅ idem ici
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], // ✅ il faut "styleUrls" (pluriel)
  providers: [ApiClientService]
})
export class AppComponent {
  private apiClient = inject(ApiClientService);

  myGuess: string = "";
  hasError = false;
  myResultDistance = 0;

  sendMyGuess() {
    if (!this.myGuess.trim()) {
      this.hasError = true;
      this.myResultDistance = 0;
      return;
    }

    this.hasError = false;

    this.apiClient.getPokemonValue({ value: this.myGuess })
      .pipe(
        catchError(err => {
          console.error("API error:", err);
          this.myResultDistance = 0;
          this.hasError = true;
          return EMPTY;
        })
      )
      .subscribe(result => {
        this.hasError = false;
        this.myResultDistance = result.value * 100;   
      });
  }
}