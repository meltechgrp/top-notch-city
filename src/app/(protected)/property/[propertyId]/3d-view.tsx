import React, { useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Asset } from 'expo-asset';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import * as THREE from 'three';
import { Renderer, loadAsync } from 'expo-three';
import { Text } from '@/components/ui';
import { Stack } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, runOnJS } from 'react-native-reanimated';

export default function Property3DView() {
	const modelRef = useRef<THREE.Group | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const zoomLevel = useRef(20); // Start zoom level
	const [isLoading, setIsLoading] = useState(true);
	const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);
	const pinchScale = useSharedValue(0.5);

	const createCamera = (gl: WebGLRenderingContext) => {
		const camera = new THREE.PerspectiveCamera(
			75,
			gl.drawingBufferWidth / gl.drawingBufferHeight,
			0.1,
			2000
		);
		camera.position.z = zoomLevel.current;
		cameraRef.current = camera;
		return camera;
	};

	const createRenderer = (gl: WebGLRenderingContext) => {
		const renderer = new Renderer({ gl });
		renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
		return renderer;
	};

	const addLighting = (scene: THREE.Scene) => {
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(0, 0, 10);
		scene.add(directionalLight);
		scene.add(new THREE.AmbientLight(0xffffff, 0.5));
		directionalLightRef.current = directionalLight;
	};

	const loadModel = async (scene: THREE.Scene) => {
		try {
			const asset = Asset.fromModule(require('@/assets/models/model2.glb'));
			await asset.downloadAsync();
			const model = await loadAsync(asset.localUri || '');
			model.scene.scale.set(1, 1, 1);
			modelRef.current = model.scene;
			scene.add(model.scene);
		} catch (error) {
			console.error('Failed to load model:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const animate = (
		renderer: Renderer,
		scene: THREE.Scene,
		camera: THREE.Camera,
		gl: ExpoWebGLRenderingContext
	) => {
		const render = () => {
			requestAnimationFrame(render);
			renderer.render(scene, camera);
			gl.endFrameEXP();
		};
		render();
	};

	const handlePinch = (scale: number) => {
		if (cameraRef.current) {
			const targetZoom = zoomLevel.current / scale;
			const smoothedZoom = THREE.MathUtils.lerp(
				zoomLevel.current,
				targetZoom,
				0.05 // smaller value = slower zoom
			);
			zoomLevel.current = THREE.MathUtils.clamp(smoothedZoom, 1, 100);
			cameraRef.current.position.z = zoomLevel.current;
		}
	};

	const handlePan = (dx: number, dy: number) => {
		if (modelRef.current) {
			modelRef.current.rotation.y += dx * 0.0001;
			modelRef.current.rotation.x += dy * 0.0001;
		}
	};

	const handleReset = () => {
		if (modelRef.current && cameraRef.current) {
			modelRef.current.rotation.set(0, 0, 0);
			zoomLevel.current = 60;
			cameraRef.current.position.z = zoomLevel.current;
		}
	};
	const pinchGesture = Gesture.Pinch()
		.onUpdate((event) => {
			pinchScale.value = event.scale;
			runOnJS(handlePinch)(event.scale);
		})
		.onEnd(() => {
			pinchScale.value = 0.5;
		});

	const panGesture = Gesture.Pan().onUpdate((event) => {
		runOnJS(handlePan)(event.translationX, event.translationY);
	});

	const doubleTapGesture = Gesture.Tap()
		.numberOfTaps(2)
		.onEnd(() => {
			runOnJS(handleReset)();
		});

	const composedGesture = Gesture.Race(
		Gesture.Simultaneous(pinchGesture, panGesture),
		doubleTapGesture
	);

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: 'Model',
				}}
			/>
			<View className="flex-1 bg-background">
				<GestureDetector gesture={composedGesture}>
					<Animated.View style={{ flex: 1 }}>
						<GLView
							style={{ flex: 1 }}
							onContextCreate={async (gl) => {
								const scene = new THREE.Scene();
								const camera = createCamera(gl);
								const renderer = createRenderer(gl);
								addLighting(scene);
								await loadModel(scene);
								animate(renderer, scene, camera, gl);
							}}
						/>
					</Animated.View>
				</GestureDetector>
				{isLoading && (
					<View style={styles.loadingOverlay}>
						<ActivityIndicator size="large" color="#fff" />
						<Text style={styles.loadingText}>Loading 3D model...</Text>
					</View>
				)}
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	loadingOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0,0,0,0.6)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 10,
	},
	loadingText: {
		marginTop: 10,
		color: '#fff',
		fontSize: 16,
	},
});
