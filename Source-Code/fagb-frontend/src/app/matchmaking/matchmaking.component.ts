import { Component, OnInit, Input } from '@angular/core';
import { MatchService } from '../_services';
import { MatchMakingResponse } from '../data_objects/matchmakingresponse';
import { MatchStatus } from '../_classes/match-status';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.scss']
})
export class MatchmakingComponent implements OnInit {
  public matchResponse: MatchMakingResponse;

  @Input() private match: MatchMakingResponse;

  public constructor(
    private matchService: MatchService,
  ) { }

  public ngOnInit(): void {
    if (this.matchService.getCompState() === MatchStatus.COMP_MATCH) {
      this.matchService.currentMatchMakingResponse.subscribe(data => this.matchResponse = data);
    } else if (this.matchService.getCompState() === MatchStatus.COMP_HISTORY) {
      this.matchResponse = this.match;
    }
  }
}
