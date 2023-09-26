"use strict";
/**
 * @module automationbotbuilder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareSet = void 0;
class MiddlewareSet {
    constructor(...middlewares) {
        this.middleware = [];
        this.use(...middlewares);
    }
    /**
     * Processes an incoming activity.
     *
     * @param context [TurnContext](xref:botbuilder-core.TurnContext) object for this turn.
     * @param next Delegate to call to continue the bot middleware pipeline.
     * @returns {Promise<void>} A Promise representing the async operation.
     */
    onTurn(context, next) {
        return this.run(context, next);
    }
    use(...middlewares) {
        middlewares.forEach((plugin) => {
            if (typeof plugin === 'function') {
                this.middleware.push(plugin);
            }
            else if (typeof plugin === 'object' && plugin.onTurn) {
                this.middleware.push((context, next) => plugin.onTurn(context, next));
            }
            else {
                throw new Error(`MiddlewareSet.use(): invalid plugin type being added.`);
            }
        });
        return this;
    }
    /**
     * Executes a set of middleware in series.
     *
     * @param context Context for the current turn of conversation with the user.
     * @param next Function to invoke at the end of the middleware chain.
     * @returns A promise that resolves after the handler chain is complete.
     */
    run(context, next) {
        const runHandlers = ([handler, ...remaining]) => {
            try {
                return Promise.resolve(handler ? handler(context, () => runHandlers(remaining)) : next());
            }
            catch (err) {
                return Promise.reject(err);
            }
        };
        return runHandlers(this.middleware);
    }
}
exports.MiddlewareSet = MiddlewareSet;
//# sourceMappingURL=middlewareSet.js.map