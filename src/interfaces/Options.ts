import { Request } from 'express';
import Awaitable from './Awaitable';
import Nullable from './Nullable';
import { DeepPartial } from './DeepProp';
import Role from './Role';
/**
 * Represents the required part of the options to create an `AuthZ` instance
 */
export interface RequiredOptions {
    /**
     * Details for the JWT authentication.
     */
    authentication: {
        /**
         * A function that returns a **user unique identifier**, agnostic to authentication method or
         * information. This identifier will be used to generate the JWT for further requests.
         */
        userIdentifier: (request: Request) => Awaitable<Nullable<string>>;
        /**
         * The JWT signing secret, this value is considered the password of the application,
         * and should not be publicly available.
         */
        secret: string;
    };
    authorization: {
        /**
         * A function that returns the roles of a given user, identified by the `userIdentifier` callback.
         */
        rolesProvider: (userId: string) => Awaitable<Role[]>;
    };
}
/**
 * Represents the optional part of the options to create an `AuthZ` instance
 */
export interface OptionalOptions {
    /**
     * Details for the JWT authentication.
     */
    authentication: {
        /**
         * The path to the authentication endpoint, defaults to `/authenticate`.
         */
        path: string;
        /**
         * The HTTP method to be used on the authentication endpoint, defaults to `POST`.
         */
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
        /**
         * The JWT expiration time span, in **seconds**, defaults to `3600`, or 1 hour.
         */
        expirationTimeSpan: number;
    };
}

/**
 * Represents the options to create an `AuthZ` instance after being filled
 * with default values
 */
export type FilledOptions = RequiredOptions & OptionalOptions;

/**
 * Represents the options to create an `AuthZ` instance
 */
type Options = RequiredOptions & DeepPartial<OptionalOptions>;

export default Options;
