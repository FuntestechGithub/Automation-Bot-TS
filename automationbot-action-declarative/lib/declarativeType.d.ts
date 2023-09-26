/**
 * @module automationbot-action-declarative
 */
import { Newable } from '../../automationbot-stdlib/lib/';
import { CustomDeserializer } from './customDeserializer';
export interface DeclarativeType<T = unknown, C = Record<string, unknown>> {
    kind: string;
    type: Newable<T, any[]>;
    loader?: CustomDeserializer<T, C>;
}
//# sourceMappingURL=declarativeType.d.ts.map