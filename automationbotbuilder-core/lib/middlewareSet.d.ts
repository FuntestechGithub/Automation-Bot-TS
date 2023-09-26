/**
 * @module automationbotbuilder
 */
import { TurnContext } from './turnContext';
export interface Middleware {
    /**
     * called each time a new request comes in
     * @param context Context for current turn of conversation with the user.
     * @param next Function to call to continue execution to the next step in the middleware chain.
     */
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void>;
}
export type MiddlewareHandler = (context: TurnContext, next: () => Promise<void>) => Promise<void>;
export declare class MiddlewareSet implements Middleware {
    private middleware;
    constructor(...middlewares: (MiddlewareHandler | Middleware)[]);
    /**
     * Processes an incoming activity.
     *
     * @param context [TurnContext](xref:botbuilder-core.TurnContext) object for this turn.
     * @param next Delegate to call to continue the bot middleware pipeline.
     * @returns {Promise<void>} A Promise representing the async operation.
     */
    onTurn(context: TurnContext, next: () => Promise<void>): Promise<void>;
    use(...middlewares: (MiddlewareHandler | Middleware)[]): this;
    /**
     * Executes a set of middleware in series.
     *
     * @param context Context for the current turn of conversation with the user.
     * @param next Function to invoke at the end of the middleware chain.
     * @returns A promise that resolves after the handler chain is complete.
     */
    run(context: TurnContext, next: () => Promise<void>): Promise<void>;
}
//# sourceMappingURL=middlewareSet.d.ts.map