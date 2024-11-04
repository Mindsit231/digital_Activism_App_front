import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ReCaptchaRequest} from '../../model/reCaptcha/re-captcha-request';
import {ReCaptchaResponse} from '../../model/reCaptcha/re-captcha-response';
import {environment} from '../../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReCaptchaService {
  protected apiBackendUrl = environment.apiBackendUrl;
  constructor(protected http: HttpClient) {}

  verifyCaptcha(reCaptchaRequest: ReCaptchaRequest): Observable<ReCaptchaResponse> {
    return this.http.post<ReCaptchaResponse>(`${this.apiBackendUrl}/public/verify-re-captcha`, reCaptchaRequest)
  }
}
