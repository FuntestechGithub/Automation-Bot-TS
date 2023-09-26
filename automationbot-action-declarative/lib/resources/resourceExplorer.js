"use strict";
/**
 * @module automationbot-action-declarative
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceExplorer = void 0;
const events_1 = require("events");
const resourceProvider_1 = require("./resourceProvider");
class ResourceExplorer {
    /**
     * @internal
     */
    constructor(providersOrOptions = []) {
        var _a;
        this._kindToType = new Map();
        this._kindDeserializer = new Map();
        this._eventEmitter = new events_1.EventEmitter(); // this module is to register an event listener and emit 
        this._cache = new Map();
        this._typesLoaded = false;
        /**
         * Gets resource type id extensions managed by resource explorer.
         */
        this.resourceTypes = new Set(['dialog', 'lu', 'lg', 'qna', 'schema', 'json']);
        if (Array.isArray(providersOrOptions)) {
            const providers = providersOrOptions;
            this.resourceProviders = providers;
        }
        else {
            const options = providersOrOptions;
            this.resourceProviders = (_a = options.providers) !== null && _a !== void 0 ? _a : [];
            if (options.declarativeTypes) {
                this._declarativeTypes = options.declarativeTypes;
            }
        }
    }
    /**
     * Event which fires when a resource is changed.
     */
    set changed(callback) {
        this._eventEmitter.on(resourceProvider_1.ResourceChangeEvent.added, (resources) => {
            callback(resourceProvider_1.ResourceChangeEvent.added, resources);
        });
        this._eventEmitter.on(resourceProvider_1.ResourceChangeEvent.changed, (resources) => {
            callback(resourceProvider_1.ResourceChangeEvent.changed, resources);
        });
        this._eventEmitter.on(resourceProvider_1.ResourceChangeEvent.removed, (resources) => {
            callback(resourceProvider_1.ResourceChangeEvent.removed, resources);
        });
    }
}
exports.ResourceExplorer = ResourceExplorer;
//# sourceMappingURL=resourceExplorer.js.map