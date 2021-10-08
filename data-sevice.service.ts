import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators'
import { GlobalData } from '../global-data';
import { DateWiseData } from '../date-wise-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
private baseUrl=`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/`;
  private globalDataUrl = '';
  private dateWiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`
  private extention='.csv';
  month;
  date;
  year;
  getdate(date:number)
  {
    if(date<10)
    {
      return '0'+date;
    }
    return date;
  }
  constructor(private http: HttpClient) { 
    let now=new Date();
    this.month=now.getMonth()+1;
    this.date=now.getDate();
    this.year=now.getFullYear();
    this.globalDataUrl=`${this.baseUrl}${this.getdate(this.month)}-${this.getdate(this.date)}-${this.year}${this.extention}`;
  }

  getDateWiseData() {
    return this.http.get(this.dateWiseDataUrl, { responseType: 'text' })
      .pipe(map(result => {
        let rows = result.split('\n');
        // console.log(rows);
        let mainData:any = {};
        let header = rows[0];
        let dates = header.split(/,(?=\S)/)
        dates.splice(0 , 4);
        rows.splice(0 , 1);
        rows.forEach(row=>{
          let cols = row.split(/,(?=\S)/)
          let con = cols[1];
          cols.splice(0 , 4);
          // console.log(con , cols);
          mainData[con] = [];
          cols.forEach((value , index)=>{
            let dw : DateWiseData = {
              cases : +value ,
              country : con , 
              date : new Date(Date.parse(dates[index])) 

            }
            mainData[con].push(dw)
          })
          
        })


        // console.log(mainData);
        return mainData;
      }))
  }

  getGlobalData():any {
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map(result => {
        let data: GlobalData[] = [];
        let raw :any= {}
        let rows = result.split('\n');
        rows.splice(0, 1);
        // console.log(rows);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/)

          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],
          };
          let temp: GlobalData = raw[cs.country];
          if (temp) {
            temp.active = cs.active + temp.active
            temp.confirmed = cs.confirmed + temp.confirmed
            temp.deaths = cs.deaths + temp.deaths
            temp.recovered = cs.recovered + temp.recovered

            raw[cs.country]= temp;
          } else {
            raw[cs.country] = cs;
          }
        })
        
        return <GlobalData[]>Object.values(raw);
      })
      ,catchError((error:HttpErrorResponse)=>
      {
        if(error.status==404)
        {
          if(this.date==1)
        {
          this.date=31;
          this.month=this.month-1;
          this.globalDataUrl=`${this.baseUrl}${this.getdate(this.month)}-${this.getdate(this.date)}-${this.year}${this.extention}`;
          return this.getGlobalData();

        }else
        {this.date=this.date-1;
          this.globalDataUrl=`${this.baseUrl}${this.getdate(this.month)}-${this.getdate(this.date)}-${this.year}${this.extention}`;
          return this.getGlobalData();
        }
        }
        
      })
      
    )
  }
}