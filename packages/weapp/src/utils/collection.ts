type CollectionItemRecord = Record<string, object>

type CollectionFactoryArgs<TItem extends CollectionItemRecord> = {
  items: TItem[]
  itemToString: (item: TItem) => object
  itemToValue: (item: TItem) => object
}

type CollectionFactory<TItem extends CollectionItemRecord, TCollection> = (
  args: CollectionFactoryArgs<TItem>
) => TCollection

export const resolveCollectionItemField = (
  item: CollectionItemRecord,
  key: string
) => item[key] ?? item

export const createCollection = <
  TItem extends CollectionItemRecord,
  TCollection
>({
  items,
  itemLabelKey,
  itemValueKey,
  factory,
}: {
  items: TItem[]
  itemLabelKey: string
  itemValueKey: string
  factory: CollectionFactory<TItem, TCollection>
}): TCollection =>
  factory({
    items,
    itemToString: (item) => resolveCollectionItemField(item, itemLabelKey),
    itemToValue: (item) => resolveCollectionItemField(item, itemValueKey),
  })

export const createScopedMachineId = (scope: string) =>
  `${scope}-${Math.random().toString(36).slice(2, 11)}`
