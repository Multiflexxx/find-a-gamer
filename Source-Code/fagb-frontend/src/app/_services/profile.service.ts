import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EditProfileResponse } from '../data_objects/editprofileresponse';
import { PublicUser } from '../data_objects/publicuser';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private url: string = 'http://localhost:3000/profileupdateendpoint';

  public constructor(
    private http: HttpClient,
  ) { }

  public updateProfile(profileUpdateValue): void {
    console.log(profileUpdateValue);
    // const publicUser: PublicUser = new PublicUser(
    //   profileUpdateValue.user_id,
    //   profileUpdateValue.nickname,
    //   profileUpdateValue.discord_tag,
    //   profileUpdateValue.cake_day,
    //   profileUpdateValue.region,
    //   profileUpdateValue.games,
    //   profileUpdateValue.languages,
    //   profileUpdateValue.profile_picture,
    //   profileUpdateValue.biography
    // );
    // return this.http.post(this.url, User);
  }
}
