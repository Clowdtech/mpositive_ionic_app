import { Injectable } from '@angular/core';
import { BaseRequestOptions, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { appConfig } from '../app/config';

@Injectable()
export class DefaultRequestOptions extends BaseRequestOptions {

    constructor() {
        super();
        this.headers.set('Content-Type', 'application/json');
    }

    merge(options?:RequestOptionsArgs):RequestOptions {
        options.url = appConfig.api_ur + options.url;
        let result = super.merge(options);
        result.merge = this.merge;
        return result;
    }
}

export const requestOptionsProvider = { provide: RequestOptions, useClass: DefaultRequestOptions };