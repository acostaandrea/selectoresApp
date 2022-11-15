import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisesSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  
  private _baseUrl: string = 'https://restcountries.com/v3.1'
  private _regiones : string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']
  
  get regiones(): string[]{
    return [...this._regiones]    //desestructurado para crear una copia
  }
  
  constructor(private http: HttpClient) { }

  getPaisesPorRegion(region : string): Observable<PaisesSmall[]>{
    
    const url: string = `${this._baseUrl}/region/${region}?fields=cca3,name`
    return this.http.get<PaisesSmall[]>(url)
  }

  getPaisPorCodigo(codigo: string): Observable<Pais[] | null>{

    if(!codigo){
      return of([])
    }

    const url: string = `${this._baseUrl}/alpha/${codigo}`
    return this.http.get<Pais[]>(url)
  }

  getPaisPorCodigoSmall(codigo: string): Observable<PaisesSmall | null>{
  
    const url: string = `${this._baseUrl}/alpha/${codigo}?fields=cca3,name`
    return this.http.get<PaisesSmall>(url)
  }

  getPaisesPorCodigos(border: string[]): Observable<PaisesSmall[]>{
    if(!border){
      return of([])
    }

    const peticiones : Observable<PaisesSmall>[] =[]

    border.forEach(codigo =>{
      const peticion: any = this.getPaisPorCodigoSmall(codigo)
      peticiones.push(peticion)
    });

    return combineLatest(peticiones)
  }


}
