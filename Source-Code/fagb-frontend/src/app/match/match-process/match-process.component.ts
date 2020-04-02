import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../_services'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-match-process',
  templateUrl: './match-process.component.html',
  styleUrls: ['./match-process.component.scss']
})
export class MatchProcessComponent implements OnInit {

  public matchData: any;
  
  constructor(
    private matchService: MatchService,
    private router: Router,) { }

  ngOnInit(): void {
    this.matchData = JSON.parse(localStorage.getItem('matchRequest'));
    console.log(this.matchData);
    console.log(this.matchData.matchmaking_request.request_id);
    // this.subscription = this.source.subscribe(data => console.log(this.matchData.matchmaking_request.request_id));

    this.matchService.notifyMatch(this.matchData.matchmaking_request.request_id).subscribe(
      (data) => {
        console.log("Notify?");
        console.log(data);
        if(!!data.users) {
          this.router.navigate(['/match-success']);
        }
      },
      (error) => {
        console.log("Nein!");
        console.log(error.error.error);
      }
    )
  }
}
