import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ROUTES } from '../routes/api.routes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailControlService {

  constructor(private http: HttpClient) { }

  ObtenerDetallesControl() {
    
  }
}
