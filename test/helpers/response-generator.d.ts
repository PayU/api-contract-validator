/// <reference path="./response-generator.js" />

import { IncomingMessage } from 'http';
import { Response } from 'superagent'

export function axios(code: number, options?: options = {}): Promise<IncomingMessage>
export function request(code: number, options?: options = {}): Promise<IncomingMessage>
export function supertest(code: number, options?: options = {}): Promise<Response>

export interface options {
    uri?: string = '/',
    method?: string = 'get',
    headers?: object,
    body?: any,
}