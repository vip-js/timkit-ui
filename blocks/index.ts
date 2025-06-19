import { blockRegistry } from "@/lib/block-registry"
import { TextBlock } from "./TextBlock"

blockRegistry.register(TextBlock)

export { TextBlock }
export default blockRegistry
