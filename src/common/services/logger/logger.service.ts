import { Injectable } from '@nestjs/common';
import { Logger, LoggerOptions } from 'winston'
import * as winston from 'winston';

/**
* @description LoggerService defines different methods which can be use to define logs.
*/
@Injectable()
export class LoggerService {

    private readonly logger: Logger;

    private static loggerOption: LoggerOptions = {
        transports: [
            new winston.transports.Console()
        ]
    }
    constructor(private context: string) {
        this.logger = (winston as any).createLogger(
            LoggerService.loggerOption
        )
    }

    /**
* @description log method is used to define normal info/logs of the request.
*/
    log(messege: string) {
        this.logger.warn(messege, {
            context: this.context
        })
    }

    /**
* @description error method is used to define error with current timestamp.
*/
    error(messege: string, trace?: any) {
        const currentDate = new Date();
        this.logger.error(`${messege} -> (${trace})`, {
            timestamp: currentDate,
            context: this.context
        })
    }

}
