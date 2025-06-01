// const loadModel = async (scene: THREE.Scene) => {
//   try {
//     const asset = Asset.fromURI(
//       generateMediaUrl(
//         '/media/3d_models/model/ai_fallback_7a8dcc54-c8d9-49fe-b1a0-3b34956ff6b2.glb'
//       )
//     );
//     await asset.downloadAsync();
//     const model = await loadAsync(asset.localUri || '');
//     model.scene.scale.set(1, 1, 1);
//     modelRef.current = model.scene;
//     scene.add(model.scene);
//   } catch (error) {
//     console.error('Failed to load model:', error);
//   } finally {
//     setIsLoading(false);
//   }
// };
