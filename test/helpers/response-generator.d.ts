/// <reference path="./response-generator.js" />

import { IncomingMessage } from 'http';
import { Response } from 'superagent'

export function axios(options: options = {}): Promise<IncomingMessage>
export function request(options: options = {}): Promise<IncomingMessage>
export function supertest(options: options = {}): Promise<Response>

export interface options {
    status: number;
    uri?: string = '/';
    method?: string = 'get';
    headers?: object;
    body?: any;
}