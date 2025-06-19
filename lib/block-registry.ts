export interface BlockMetadata {
  name: string
  type: string
  tags?: string[]
  description?: string
  responsive?: boolean
  dependencies?: string[]
}

export interface BlockModule {
  metadata: BlockMetadata
  component: React.ComponentType<any>
}

class BlockRegistry {
  private blocks = new Map<string, BlockModule>()

  register(block: BlockModule) {
    this.blocks.set(block.metadata.name, block)
  }

  get(name: string): BlockModule | undefined {
    return this.blocks.get(name)
  }

  list(): BlockMetadata[] {
    return Array.from(this.blocks.values()).map((b) => b.metadata)
  }
}

export const blockRegistry = new BlockRegistry()
