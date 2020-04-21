import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../_services';
import { Router } from '@angular/router';

import { interval, Subscription, Observable } from 'rxjs';
import { MatchMakingResponse } from 'src/app/data_objects/matchmakingresponse';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-match-process',
  templateUrl: './match-process.component.html',
  styleUrls: ['./match-process.component.scss']
})
export class MatchProcessComponent implements OnInit {

  public matchData: MatchMakingResponse;

  private subscription: Subscription;
  private i: Observable<number> = interval(1000);

  public constructor(
    private matchService: MatchService,
    private router: Router,
    private toastrService: ToastrService,
  ) { }

  public ngOnInit(): void {
    this.matchData = JSON.parse(localStorage.getItem('matchMakingResponse'));
    let num: number = 0;

    this.subscription = this.i.subscribe(
      (d) => {
        num = num + 1;
        this.matchService.notifyMatch(this.matchData.matchMakingRequest.request_id).subscribe(
          (data) => {
            if (!!data.matchedUsers) {
              this.subscription.unsubscribe();
              this.router.navigate(['/match-success']);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    );
  }

  public onRequestDelete(): void {
    this.matchService.deleteRequest(this.matchData.matchMakingRequest.request_id).subscribe(
      (data) => {
        this.subscription.unsubscribe();
        localStorage.removeItem('matchMakingResponse');
        this.router.navigate(['/match']);
        this.toastrService.success('Match request with id ' + data.request.request_id + ' was deleted');
      },
      (error) => {
        console.log(error.error.error);
        this.toastrService.error(error.error.error);
      }
    );
  }

}
