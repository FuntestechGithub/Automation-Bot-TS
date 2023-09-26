import { ServiceCollection } from '../../automationbot-action-adaptive-runtime-core/lib'
import { Configuration } from './configuration'
import path from 'path';
import fs from 'fs';

import { MiddlewareSet } from '../../automationbotbuilder/lib'


export async function getRuntimeServices(
    applicationRoot: string,
    settingsDirectory: string
):Promise<[ServiceCollection, Configuration]>


export async function getRuntimeServices(
    applicationRoot: string,
    configuration: Configuration
):Promise<[ServiceCollection, Configuration]>

export async function getRuntimeServices(
    applicationRoot: string,
    configurationOrSettingsDirectory: string | Configuration
): Promise<[ServiceCollection, Configuration]> {
    let configuration: Configuration;
    if (typeof configurationOrSettingsDirectory === 'string') {
        // initializes the configuration and loads both arguments value and environment variables to configuration store
        configuration = new Configuration().argv().env();
        
        const files = ['appseetings.json'];
        files.forEach((file) => configuration.file(path.join(configurationOrSettingsDirectory, file)));
        await normalizeConfiguration(configuration, applicationRoot);
    }
    /**
     * Here defines all default services (in Record type) for ServiceCollection class
     */
    const services =  new ServiceCollection({
        declarativeTypes: [],
        memoryScopes: [],
        customAdapters: new Map(),
        middlewares: new MiddlewareSet(),
    })
    return [services, configuration];
}

async function normalizeConfiguration(configuration: Configuration, applicationRoot: string): Promise<void> {
    // Override applicationRoot setting
    configuration.set(['applicationRoot'], applicationRoot);

    // Override root dialog setting
    configuration.set(
        ['defaultRootDialog'],
        await new Promise<string | undefined>((resolve, reject) =>
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            fs.readdir(applicationRoot, (err, files) =>
                err ? reject(err) : resolve(files.find((file) => file.endsWith('.dialog')))
            )
        )
    );
}