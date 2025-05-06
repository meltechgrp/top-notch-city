import Loading from '@/components/search/Loading'
import NoResult from '@/components/search/NoResult'
import { FlashList } from '@shopify/flash-list'
import { ComponentType, useMemo } from 'react'
import { View } from 'react-native'

type SearchResultTabViewProps<ItemType = any> = {
  itemRenderer: (item: ItemType) => JSX.Element
  items: ItemType[]
  totalCount: number
  loading: boolean
  ItemSeparatorComponent: ComponentType<any>
}

export default function SearchResultTabView(props: SearchResultTabViewProps) {
  const { itemRenderer, items, totalCount, loading, ItemSeparatorComponent } =
    props

  const renderItem = useMemo(() => (item: any) => itemRenderer(item), [])

  return (
    <View className="flex-1">
      {loading ? (
        <Loading />
      ) : (
        <FlashList
          data={items || []}
          renderItem={renderItem}
          keyExtractor={({ item }, i) => item?.id?.toString() || `${i}`}
          ItemSeparatorComponent={ItemSeparatorComponent}
          estimatedItemSize={80}
          contentContainerClassName="pt-8 px-4"
          ListEmptyComponent={loading ? null : NoResult}
        />
      )}
    </View>
  )
}
