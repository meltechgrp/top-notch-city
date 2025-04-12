// import { type ImageProps, Image as ExpoImage } from 'expo-image'
// import { useEffect, useState } from 'react'

// interface ImageProcessorProps extends Omit<ImageProps, 'resizeMode'> {
//   path: string
//   width: number
//   height: number
//   quality?: number
//   resolution?: 'x' | '2x' | '3x'
//   resizeMode?: 'fill' | 'contain'
// }
// export default function ImageProcessor(props: ImageProcessorProps) {
//   const {
//     path,
//     width,
//     height,
//     quality,
//     resizeMode = 'contain',
//     style,
//     ...prps
//   } = props
//   const [loading, setLoading] = useState(false)
//   const [processedUrl, setProcessedUrl] = useState('')
//   const [error, setError] = useState('')
//   const computedRes = {
//     x: 1,
//     '2x': 2,
//     '3x': 3,
//   }[props.resolution || 'x']

//   const key = `${path}-${width}-${height}-${quality}-${resizeMode}`

//   useEffect(() => {
//     if (props.path.startsWith('file://')) {
//       setProcessedUrl(props.path)
//       return
//     }
//     setLoading(true)
//     const cache = storage.getString(key)
//     if (cache) {
//       setProcessedUrl(cache)
//       setLoading(false)
//       return
//     }
//     generateProcessingUrl({
//       width: props.width * computedRes,
//       height: props.height * computedRes,
//       path: props.path,
//       quality: props.quality || 80,
//       resizeMode,
//     })
//       .then((url) => {
//         setProcessedUrl(url)
//         storage.set(key, url)
//       })
//       .catch((err) => {
//         setError(err)
//       })
//       .finally(() => {
//         setLoading(false)
//       })
//   }, [props])
//   return loading || error ? null : (
//     <ExpoImage
//       key={processedUrl}
//       source={{
//         uri: processedUrl,
//       }}
//       style={[
//         {
//           width,
//           height,
//         },
//         style,
//       ]}
//       contentFit="contain"
//       cachePolicy={'memory-disk'}
//       onError={() => {
//         storage.delete(key)
//       }}
//       {...prps}
//     />
//   )
// }
