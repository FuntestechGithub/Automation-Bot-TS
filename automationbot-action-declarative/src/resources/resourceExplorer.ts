/**
 * @module automationbot-action-declarative
 */

import { Newable } from "../../../automationbot-stdlib/lib";
import { ComponentDeclarativeTypes } from "../componentDeclarativeTypes";
import { CustomDeserializer } from "../customDeserializer";
import { EventEmitter } from 'events';
import { ResourceProvider, ResourceChangeEvent } from "./resourceProvider";
import { ResourceExplorerOptions } from "./resourceExplorerOptions";
import { Resource } from './resource';

export class ResourceExplorer{
    private _declarativeTypes: ComponentDeclarativeTypes[];
    private _kindToType: Map<string, Newable<unknown>> = new Map();
    private _kindDeserializer: Map<string, CustomDeserializer<unknown, unknown>> = new Map();
    private _eventEmitter: EventEmitter = new EventEmitter(); // this module is to register an event listener and emit 
    private _cache = new Map<string, unknown>();
    private _typesLoaded = false;

    /**
     * Initializes a new instance of the [ResourceExplorer](botbuilder-dialogs.declarative.ResourceExplorer) class.
     *
     * @param {ResourceProvider[]} providers The list of [ResourceProvider](botbuilder-dialogs-declarative.ResourceProvider) to initialize the current instance.
     */
    constructor(providers: ResourceProvider[]);

    /**
     * Initializes a new instance of the [ResourceExplorer](botbuilder-dialogs.declarative.ResourceExplorer) class.
     *
     * @param {ResourceExplorerOptions} options The configuration options.
     */
    constructor(options?: ResourceExplorerOptions);

    /**
     * @internal
     */
    constructor(providersOrOptions: ResourceProvider[] | ResourceExplorerOptions = []) {
        if (Array.isArray(providersOrOptions)) {
            const providers: ResourceProvider[] = providersOrOptions;
            this.resourceProviders = providers;
        }
        else {
            const options: ResourceExplorerOptions = providersOrOptions;
            this.resourceProviders = options.providers ?? [];
            if (options.declarativeTypes) {
                this._declarativeTypes = options.declarativeTypes;
            }
        }
    }

    /**
     * Gets resource providers.
     */
    readonly resourceProviders: ResourceProvider[];

    /**
     * Gets resource type id extensions managed by resource explorer.
     */
    readonly resourceTypes: Set<string> = new Set(['dialog', 'lu', 'lg', 'qna', 'schema', 'json']);

    /**
     * Event which fires when a resource is changed.
     */
    /**
     * changed() is a setter method that sets the callback function for the event emitter.
     */
    set changed(callback: (event: ResourceChangeEvent, resources: Resource[]) => void) {
        this._eventEmitter.on(ResourceChangeEvent.added, (resources: Resource[]): void => {
            callback(ResourceChangeEvent.added, resources);
        });
        this._eventEmitter.on(ResourceChangeEvent.changed, (resources: Resource[]): void => {
            callback(ResourceChangeEvent.changed, resources);
        });
        this._eventEmitter.on(ResourceChangeEvent.removed, (resources: Resource[]): void => {
            callback(ResourceChangeEvent.removed, resources);
        });
    }    

    /**
     * Get resources of a given type extension.
     *
     * @param {string} fileExtension File extension filter.
     * @returns {Resource[]} The resources.
     */
    getResources(fileExtension: string): Resource[] {
        const resources: Resource[] = [];
        for (const rp of this.resourceProviders) {
            for (const rpResources of rp.getResources(fileExtension)) {
                resources.push(rpResources);
            }
        }

        return resources;
    }    
    
    /**
     * Gets resource by id.
     *
     * @param {string} id Resource id.
     * @returns {Resource} The resource, or undefined if not found.
     */
    getResource(id: string): Resource {
        for (const rp of this.resourceProviders) {
            const resource: Resource = rp.getResource(id);
            if (resource) {
                return resource;
            }
        }

        return undefined;
    }

}