import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-sevice.service';
import { GlobalData } from 'src/app/global-data';
import { DateWiseData } from 'src/app/date-wise-data';
import { merge} from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data: GlobalData[] =[];
  countries : string[] =[];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  selectedCountryData: DateWiseData[] = []; 
  dateWiseData:any;
  loading = true;
  options!: {
    height: 500;
    animation: {
      duration: 1000;
      easing: 'out';
    };
  }; 
 
  constructor(private service : DataServiceService) { }

  ngOnInit(): void {

    merge(
      
     this.service.getGlobalData().pipe(map(result=>{
        this.data != result;
        this.data.forEach(cs=>{
           this.countries.push(cs.country);
           console.log(cs.country);
        })
      })),this.service.getDateWiseData().pipe(
        map(result=>{
          this.dateWiseData = result;
        })
      ) 
     
    ).subscribe(
      {
        complete : ()=>{
         this.updateValues('India')
         this.loading = false;
        }
      }
    )
    
    

  }
  

  updateChart(){
    let dataTable = [];
    dataTable.push(["Date" , 'Cases'])
    this.selectedCountryData.forEach(cs=>{
      dataTable.push([cs.date , cs.cases])
    })

   
  }

  updateValues(country : string){
    console.log(country);
    this.data.forEach(cs=>{
      if(cs.country == country){
        this.totalActive = cs.active
        this.totalDeaths = cs.deaths
        this.totalRecovered = cs.recovered
        this.totalConfirmed = cs.confirmed
      }
    })

    this.selectedCountryData  = this.dateWiseData[country]
     //console.log(this.selectedCountryData);
    this.updateChart();
    
  }
  

}