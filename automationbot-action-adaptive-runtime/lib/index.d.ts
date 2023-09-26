import { ServiceCollection } from '../../automationbot-action-adaptive-runtime-core/lib';
import { Configuration } from './configuration';
export declare function getRuntimeServices(applicationRoot: string, settingsDirectory: string): Promise<[ServiceCollection, Configuration]>;
export declare function getRuntimeServices(applicationRoot: string, configuration: Configuration): Promise<[ServiceCollection, Configuration]>;
//# sourceMappingURL=index.d.ts.map