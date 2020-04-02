import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../_services';
import { Router } from '@angular/router';

import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-match-process',
  templateUrl: './match-process.component.html',
  styleUrls: ['./match-process.component.scss']
})
export class MatchProcessComponent implements OnInit {

  public matchData: any;

  private subscription: Subscription;
  private i = interval(1000);

  constructor(
    private matchService: MatchService,
    private router: Router, ) { }

  ngOnInit(): void {
    this.matchData = JSON.parse(localStorage.getItem('matchRequest'));
    console.log(this.matchData);
    console.log(this.matchData.matchmaking_request.request_id);
    let num: number = 0;

    this.subscription = this.i.subscribe(
      (d) => {
        num = num + 1;
        this.matchService.notifyMatch(this.matchData.matchmaking_request.request_id).subscribe(
          (data) => {
            console.log("Notify?");
            console.log(data);
            if (!!data.users) {
            // if (num == 4) {
              this.subscription.unsubscribe();
              this.router.navigate(['/match-success']);
            }
          },
          (error) => {
            console.log("Nein!");
            console.log(error.error.error);
          }
        )
      }
    );
  }
}
