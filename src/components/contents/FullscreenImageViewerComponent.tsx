// import ZoomView from '@/components/contents/ZoomView'
// import Layout from '@/constants/Layout'
// import { resizeMediaByMaxDiamensions } from '@/lib/utils'
// import { useState } from 'react'
// import { FlatList, Pressable, View } from 'react-native'

// type ImageViewerProps = {
//   media: HomeFeedPost['media']
//   currentIndex: number
//   onPress?: () => void
//   onSlideDown: () => void
//   setBackgroundColorVisibility: React.Dispatch<React.SetStateAction<boolean>>
// }

// export function FullscreenImageViewerComponent(props: ImageViewerProps) {
//   const { media, onPress, currentIndex } = props
//   const [zoomLevel, setZoomLevel] = useState(1)
//   const MAX_WIDTH = Layout.window.width
//   const MAX_HEIGHT = Layout.window.height * 0.8
//   const mediaList = resizeMediaByMaxDiamensions(
//     media as any,
//     MAX_WIDTH,
//     MAX_HEIGHT
//   )
//   const [contentOffsetX, setContentOffsetX] = useState(currentIndex * MAX_WIDTH)
//   const renderImage = (media: HomeFeedPost['media'][0]) => {
//     return (
//       <Pressable
//         style={[{ width: MAX_WIDTH }]}
//         className="w-full h-full items-center justify-center  "
//         onPress={() => onPress!()}
//       >
//         <ZoomView
//           onZoom={setZoomLevel}
//           style={[{ width: MAX_WIDTH }]}
//           onSlideDown={props.onSlideDown}
//           setBackgroundColorVisibility={props.setBackgroundColorVisibility}
//           className="items-center justify-center"
//         >
//           <ImageProcessor
//             path={media.path}
//             width={media.width || MAX_WIDTH}
//             height={media.height || MAX_HEIGHT}
//             style={{
//               width: (media.width || MAX_WIDTH) - 8,
//               height: media.height || MAX_HEIGHT,
//             }}
//             contentFit="contain"
//             quality={100}
//             resolution="3x"
//           />
//         </ZoomView>
//       </Pressable>
//     )
//   }
//   return (
//     <View
//       style={[{ height: Layout.window.height, position: 'relative' }]}
//       className=" items-center justify-center relative"
//     >
//       {mediaList.length > 1 ? (
//         <>
//           <View
//             style={[{ backgroundColor: 'rgba(60, 60, 67, 0.5)' }]}
//             className="items-center justify-center absolute bottom-12 z-10 flex-row w-[48px] h-[24px] rounded-[100px]"
//           >
//             <MediumText className="text-white text-xs">
//               {Math.round(contentOffsetX / MAX_WIDTH) + 1}
//             </MediumText>
//             <MediumText className="text-white text-xs mx-0.5">/</MediumText>
//             <MediumText className="text-white text-xs">
//               {media.length}
//             </MediumText>
//           </View>
//           <FlatList
//             scrollEnabled={zoomLevel <= 1}
//             data={mediaList}
//             renderItem={({ item }) => {
//               return renderImage(item)
//             }}
//             keyExtractor={(item) => item?.id}
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onMomentumScrollEnd={(ev) => {
//               setContentOffsetX(ev.nativeEvent.contentOffset.x)
//             }}
//             initialScrollIndex={currentIndex}
//             getItemLayout={(_, index) => ({
//               length: MAX_WIDTH,
//               offset: MAX_WIDTH * index,
//               index,
//             })}
//           />
//         </>
//       ) : (
//         renderImage(mediaList[0])
//       )}
//     </View>
//   )
// }
