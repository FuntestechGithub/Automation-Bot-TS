import express, {Application} from "express";
import type {Server} from "http";
import * as z from "zod";
import { getRuntimeServices } from '../../automationbot-action-adaptive-runtime/lib'
import { ServiceCollection } from "../../automationbot-action-adaptive-runtime-core/lib";
import { Configuration } from "../../automationbot-action-adaptive-runtime/lib/configuration"; 


/**
 * Specify the defaultOptions and its dependancies
 */
const NonEmptyString = z
    .string()
    .refine((str) => str.length > 0, {message: "Must be a non-empty string"})

const TypedOptions = z.object({
    logErrors: z.boolean(),
    actionsEndpointPath: NonEmptyString,
    skillsEndpointPrefix: NonEmptyString,
    port: z.union([NonEmptyString, z.number()]), // union acception all types in the list
    staticDir: NonEmptyString
})

export type Options = z.infer<typeof TypedOptions>

const defaultOptions: Options = {
    logErrors: true,
    actionsEndpointPath: "/actions",
    skillsEndpointPrefix: "/skills",
    port: 3978,
    staticDir: "wwwroot"
}



export async function makeApp(
    services: ServiceCollection,
    configuration: Configuration,
    app: Application = express()
): Promise<[Application, (callback?:()=>void) => Server]>{
    
    // to make a instance, the graph needs to have its node first.     
    const {declarativeTypes,memoryScopes} = services.mustMakeInstances<{
        declarativeTypes: number;
        memoryScopes: string;
    }>('declarativeTypes', 'memoryScopes')

    // const adapter = services.mustMakeInstance('adapter')
    

    return [
        app,
        (callback) => {
            const server = app.listen(
                3978,
                callback ?? (() => console.log(`server listening on port 3978`))
            )
            return server
        }
    ]
}

export async function start(
    applicationRoot: string,
    settingsDirectory: string,
    
):Promise<void> {
    const [services, configuration] = await getRuntimeServices(applicationRoot, settingsDirectory);
    const [, listen] = await makeApp(services, configuration);
    
    listen()
}
