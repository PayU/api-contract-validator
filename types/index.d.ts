// TypeScript Version: 3.2
export {};
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
