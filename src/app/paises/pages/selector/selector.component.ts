import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisesSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styles: [
  ]
})
export class SelectorComponent implements OnInit {

  
  miFormulario: FormGroup= this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  })


  //llenar selectores
  
  regiones: string[] =[]

  paises: PaisesSmall[] = []

  //fronteras : string [] = [] 
  fronteras : PaisesSmall [] = [] 


  //ui

  cargando: boolean= false
  
  constructor(private fb: FormBuilder,
              private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones

    //cuando cambie la region

    // this.miFormulario.get('region')?.valueChanges
    // .subscribe(region =>{
    //   console.log(region)
    //   this.paisesService.getPaisesPorRegion(region)
    //   .subscribe(paises =>{
    //     console.log(paises);
    //     this.paises = paises
    //   })
    // })

    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap((_) =>{
        this.miFormulario.get('pais')?.reset('');
        this.cargando = true;
      }),
      switchMap(region => this.paisesService.getPaisesPorRegion(region))
    )
    .subscribe(paises =>{
      this.paises = paises;
      this.cargando=false
    })

    
    //Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap((_)=>{
        this.fronteras =[];
        this.miFormulario.get('frontera')?.reset('');
        this.cargando = true;
        
      }),
      switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
      switchMap(pais => this.paisesService.getPaisesPorCodigos(pais![0]?.borders))
    )
    .subscribe(paises =>{
    console.log(paises);
    //this.fronteras = pais![0]?.borders || []
    this.fronteras = paises
    this.cargando=false
      
    })

  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
