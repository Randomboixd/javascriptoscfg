import type GSchemaSet from "../types/GSchema";
import type { GSchemaOptions } from "../types/GSchema";

/**
 * Build a GSchemaSet!
 */
export default (name: string, options: GSchemaOptions): GSchemaSet => {
    return {
        path: name,
        options
    }
}