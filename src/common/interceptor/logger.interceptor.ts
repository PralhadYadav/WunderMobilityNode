import { LoggerService } from './../services/logger/logger.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Module } from '@nestjs/common';
import { Observable, tap } from 'rxjs';


/**
* @description LoggerInterceptor use to log all details of incoming request and outgoing response.
*/
@Injectable()
export class LoggerInterceptor implements NestInterceptor {

  private readonly loggerService: LoggerService = new LoggerService(LoggerInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const beforeDate = Date.now();
    this.loggerService.log(`Process started at ${beforeDate}`);
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    this.loggerService.log(`Requested method ${method} and url ${url}`)

    return next.handle().pipe(
      tap(() => {
        this.loggerService.log(`Process end in ${Date.now() - beforeDate}ms`)
      })
    );
  }
}
