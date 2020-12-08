// TypeScript Version: 3.2
declare global {
    // eslint-disable-next-line no-redeclare
    namespace jest {
        interface Matchers<R> {
            toMatchApiSchema: () => void;

            toBeSuccessful: () => void;
            toBeCreated: () => void;
            toBeBadRequest: () => void;
            toBeUnauthorized: () => void;
            toBeForbidden: () => void;
            toBeNotFound: () => void;
            toBeServerError: () => void;
            toBeServiceUnavailable: () => void;
            toBeGatewayTimeout: () => void;
            toHaveStatus: (expectedStatusCode: number) => void;
        }
    }

    namespace Chai {
        interface Assertion {
            matchApiSchema(): Assertion;

            successful(): Assertion;
            created(): Assertion;
            badRequest(): Assertion;
            unauthorized(): Assertion;
            forbidden(): Assertion;
            notFound(): Assertion;
            serverError(): Assertion;
            serviceUnavailable(): Assertion;
            gatewayTimeout(): Assertion;
            status(expectedStatusCode: number): Assertion;
        }
    }

    namespace should {
        interface Assertion {
            matchApiSchema(): this;

            successful(): this;
            created(): this;
            badRequest(): this;
            unauthorized(): this;
            forbidden(): this;
            notFound(): this;
            serverError(): this;
            serviceUnavailable(): this;
            gatewayTimeout(): this;
            status(expectedStatusCode: number): this;
        }
    }
}

export function chaiPlugin(options: ValidatorOptions): (chai: any) => void;
export function jestPlugin(options: ValidatorOptions): void;
export function shouldPlugin(should: Function, options: ValidatorOptions): void;
export const validators: {
    schemaValidator: (obj: any, options?: ValidatorOptions) => SchemaValidationResult;
    statusValidator: (expectedStatus: number, obj: any) => StatusValidationResult;
};

export interface ValidatorOptions {
    apiDefinitionsPath: string | Array<string>;
    reportCoverage?: boolean;
    exportCoverage?: boolean;
}

export interface SchemaValidationResult {
    predicate: boolean;
    actual: any;
    expected: any;
    errors: any[];
    matchMsg: string;
    noMatchMsg: string;
}

export interface StatusValidationResult {
    predicate: boolean;
    actual: {
        status?: number;
        body?: Record<string, any>;
    };
    expected: {
        status?: number;
    };
    matchMsg: string;
    noMatchMsg: string;
}
