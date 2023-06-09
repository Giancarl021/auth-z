import fillObject from 'fill-object';
import Options, {
    FilledOptions,
    OptionalOptions,
    RequiredOptions
} from '../interfaces/Options';
import constants from './constants';
import { DeepPartial } from '../interfaces/DeepProp';

/**
 * Helper function that checks if all the properties of an object are defined
 */
function deepCheckObject(object: object, prefix: string = '') {
    for (const [key, value] of Object.entries(object)) {
        if (value === undefined)
            throw new Error(`Missing required option: ${prefix}${key}`);

        if (typeof value === 'object' && value !== null)
            deepCheckObject(value, `${prefix}${key}.`);
    }
}

/**
 * Helper function that fills the missing properties of the `Options` object
 * with default values
 */
export default function parseOptions(options: Options): FilledOptions {
    /**
     * Separation of the required and optional options
     */
    const requiredOptions: RequiredOptions = {
        authentication: {
            secret: options.authentication.secret,
            userIdentifier: options.authentication.userIdentifier
        },
        authorization: {
            rolesProvider: options.authorization.rolesProvider
        }
    };

    const _optionalOptions: DeepPartial<OptionalOptions> = {
        authentication: {
            expirationTimeSpan: options.authentication.expirationTimeSpan,
            method: options.authentication.method,
            path: options.authentication.path
        }
    };

    /**
     * Check validity of the required options
     */
    deepCheckObject(requiredOptions);

    /**
     * Fill the missing properties of the optional options with default values
     */
    const optionalOptions: OptionalOptions = fillObject(
        _optionalOptions as Partial<OptionalOptions>,
        constants.defaultOptions,
        true
    );

    /**
     * Spread the required and optional options into the final object
     */
    const filledOptions = {
        authentication: {
            ...optionalOptions.authentication,
            ...requiredOptions.authentication
        },
        authorization: {
            ...requiredOptions.authorization
        }
    };

    return filledOptions;
}
