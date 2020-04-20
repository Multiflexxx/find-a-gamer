import { Component, OnInit } from '@angular/core';
import { MatchService } from '../_services/match.service';
import { MatchStatus } from '../_classes/match-status';
import { MatchMakingResponse } from '../data_objects/matchmakingresponse';
import { MatchHistoryResponse } from '../data_objects/matchhistoryresponse';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  public matchHistory: Array<MatchMakingResponse> = [];
  public historyResponse: MatchHistoryResponse;

  public loading: boolean;

  // MatPaginator Output
  public pageEvent: PageEvent;
  public pageIndex: number = 0;
  public pageSize: number = 5;

  public constructor(
    private matchService: MatchService,
  ) { }

  public ngOnInit(): void {
    this.loading = true;
    this.matchService.setCompState(MatchStatus.COMP_HISTORY);
    this.matchService.getMatchHistory(0, this.pageSize).subscribe(
      (data) => {
        this.loading = false;
        console.log(data);
        this.historyResponse = data;
        this.matchHistory = data.matchHistory;
      },
      (error) => {
        this.loading = false;
        console.log(error.error.error);
      }
    );
  }

  public handlePage(event: any): any {
    console.log(event);
    this.loading = true;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.matchService.getMatchHistory(event.pageIndex, this.pageSize).subscribe(
      (data) => {
        this.loading = false;
        console.log(data);
        this.historyResponse = data;
        this.matchHistory = data.matchHistory;
      },
      (error) => {
        this.loading = false;
        console.log(error.error.error);
      }
    );
    return event;
  }

  // For new pagination relevant
  private calculatePageAmount(): number {
    return Math.ceil(this.historyResponse.totalAmount / 10);
  }

}
