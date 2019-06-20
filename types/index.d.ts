// TypeScript Version: 3.2
declare global {
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
            toHaveStatus: (expectedStatusCode: string) => void;
        }
    }
}

export function chaiPlugin(options: any): (chai: any) => void;
export function jestPlugin(options: any): void;
export function shouldPlugin(options: any): void;
export const validators: {
    schemaValidator: (obj: any, options?: any) => any
    statusValidator: (expectedStatus: any, obj: any) => any
};
