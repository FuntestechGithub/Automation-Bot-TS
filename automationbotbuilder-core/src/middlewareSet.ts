/**
 * @module automationbotbuilder
 */

import { TurnContext } from './turnContext';

export interface Middleware{
    /**
     * called each time a new request comes in
     * @param context Context for current turn of conversation with the user.
     * @param next Function to call to continue execution to the next step in the middleware chain.
     */
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void>;
}

export type MiddlewareHandler = (context: TurnContext, next: () => Promise<void>) => Promise<void>;

export class MiddlewareSet implements Middleware{
    private middleware: MiddlewareHandler[] = [];

    constructor(...middlewares: (MiddlewareHandler | Middleware)[]){
        this.use(...middlewares);
    }

    /**
     * Processes an incoming activity.
     *
     * @param context [TurnContext](xref:botbuilder-core.TurnContext) object for this turn.
     * @param next Delegate to call to continue the bot middleware pipeline.
     * @returns {Promise<void>} A Promise representing the async operation.
     */    
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        return this.run(context, next);
    }

    use(...middlewares: (MiddlewareHandler | Middleware)[]): this{
        middlewares.forEach((plugin) => {
            if (typeof plugin === 'function') {
                this.middleware.push(plugin);
            } else if (typeof plugin === 'object' && plugin.onTurn) {
                this.middleware.push((context, next) => plugin.onTurn(context, next));
            } else {
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
    run(context: TurnContext, next: () => Promise<void>): Promise<void> {
        const runHandlers = ([handler, ...remaining]: MiddlewareHandler[]) => {
            try {
                return Promise.resolve(handler ? handler(context, () => runHandlers(remaining)) : next());
            } catch (err) {
                return Promise.reject(err);
            }
        };

        return runHandlers(this.middleware);
    }
}