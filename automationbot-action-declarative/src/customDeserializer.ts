/**
 * @module automationbot-action-declarative
 */

import {Newable} from '../../automationbot-stdlib/lib/'

/**
 * Defines the contract for a deserializer from a configuration object to a typed object.
 */
export interface CustomDeserializer<T, C> {
    load(config: C, type: Newable<T, any[]>): T;
}