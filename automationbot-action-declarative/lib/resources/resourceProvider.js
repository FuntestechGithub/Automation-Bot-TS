"use strict";
/**
 * @module automationbot-action-declarative
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceProvider = exports.ResourceChangeEvent = void 0;
const events_1 = require("events");
/**
 * Resource change event types.
 * added - a new resource has been added.
 * changed - an existing resource has been changed.
 * removed - an existing resource has been removed.
 */
var ResourceChangeEvent;
(function (ResourceChangeEvent) {
    ResourceChangeEvent["added"] = "added";
    ResourceChangeEvent["changed"] = "changed";
    ResourceChangeEvent["removed"] = "removed";
})(ResourceChangeEvent || (exports.ResourceChangeEvent = ResourceChangeEvent = {}));
/**
 * Abstract class for looking up a resource by id.
 */
class ResourceProvider {
    /**
     * Initialize an instance of `ResourceProvider` class.
     *
     * @param resourceExplorer Resource explorer.
     */
    constructor(resourceExplorer) {
        this._eventEmitter = new events_1.EventEmitter();
        this._resourceExplorer = resourceExplorer;
    }
    /**
     * Event which is fired if any resource managed by the resource provider detects changes to the underlining resource.
     *
     * @param callback Callback function to be called when an event fired.
     */
    set changed(callback) {
        this._eventEmitter.on(ResourceChangeEvent.added, (resources) => {
            callback(ResourceChangeEvent.added, resources);
        });
        this._eventEmitter.on(ResourceChangeEvent.changed, (resources) => {
            callback(ResourceChangeEvent.changed, resources);
        });
        this._eventEmitter.on(ResourceChangeEvent.removed, (resources) => {
            callback(ResourceChangeEvent.removed, resources);
        });
    }
    /**
     * Gets the resource explorer.
     *
     * @returns The resource explorer.
     */
    get resourceExplorer() {
        return this._resourceExplorer;
    }
    /**
     * Gets the ID for this resource provider.
     *
     * @returns The ID for this resource provider.
     */
    get id() {
        return this._id;
    }
    /**
     * @protected
     * Actions to perform when the current object is changed.
     * @param event Resource change event.
     * @param resources A collection of changed resources.
     */
    onChanged(event, resources) {
        if (this._eventEmitter) {
            this._eventEmitter.emit(event, resources);
        }
    }
}
exports.ResourceProvider = ResourceProvider;
//# sourceMappingURL=resourceProvider.js.map