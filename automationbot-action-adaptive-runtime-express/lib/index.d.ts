/// <reference types="node" />
import { Application } from "express";
import type { Server } from "http";
import * as z from "zod";
import { ServiceCollection } from "../../automationbot-action-adaptive-runtime-core/lib";
import { Configuration } from "../../automationbot-action-adaptive-runtime/lib/configuration";
declare const TypedOptions: z.ZodObject<{
    logErrors: z.ZodBoolean;
    actionsEndpointPath: z.ZodEffects<z.ZodString, string, string>;
    skillsEndpointPrefix: z.ZodEffects<z.ZodString, string, string>;
    port: z.ZodUnion<[z.ZodEffects<z.ZodString, string, string>, z.ZodNumber]>;
    staticDir: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    logErrors?: boolean;
    actionsEndpointPath?: string;
    skillsEndpointPrefix?: string;
    port?: string | number;
    staticDir?: string;
}, {
    logErrors?: boolean;
    actionsEndpointPath?: string;
    skillsEndpointPrefix?: string;
    port?: string | number;
    staticDir?: string;
}>;
export type Options = z.infer<typeof TypedOptions>;
export declare function makeApp(services: ServiceCollection, configuration: Configuration, app?: Application): Promise<[Application, (callback?: () => void) => Server]>;
export declare function start(applicationRoot: string, settingsDirectory: string): Promise<void>;
export {};
//# sourceMappingURL=index.d.ts.map