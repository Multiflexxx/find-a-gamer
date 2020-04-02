import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { MatchService } from '../../_services'; 

@Component({
  selector: 'app-match-process',
  templateUrl: './match-process.component.html',
  styleUrls: ['./match-process.component.scss']
})
export class MatchProcessComponent implements OnInit {

  public matchData: any;
  
  // subscription: Subscription;

  // public source = interval(5000);

  constructor(private matchService: MatchService,) { }

  ngOnInit(): void {
    this.matchData = JSON.parse(localStorage.getItem('matchRequest'));
    console.log(this.matchData);
    // this.subscription = this.source.subscribe(data => console.log("Ausgeführt!"));


    this.matchService.notifyMatch(this.matchData.matchmakingRequest.request_id).subscribe(
      (data) => {
        console.log("Notify?");
        console.log(data);
      },
      (error) => {
        console.log("Nein!");
        console.log(error.error.error);
      }
    )
  }
}
