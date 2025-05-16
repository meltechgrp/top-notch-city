import React, { useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { Renderer, loadAsync } from 'expo-three';
import { Grid, GridItem } from '@/components/ui/grid';
import { Button, ButtonText, Text } from '@/components/ui';
import { Stack } from 'expo-router';

export default function Property3DView() {
	const modelRef = useRef<THREE.Group | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const zoomLevel = useRef(5); // Start zoom level
	const [isLoading, setIsLoading] = useState(true);

	const rotateModel = (axis: 'x' | 'y', delta: number) => {
		if (modelRef.current) {
			modelRef.current.rotation[axis] += delta;
		}
	};

	const zoomCamera = (delta: number) => {
		if (cameraRef.current) {
			zoomLevel.current += delta;
			cameraRef.current.position.z = zoomLevel.current;
		}
	};

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: 'Model',
				}}
			/>
			<View className="flex-1 bg-background">
				<GLView
					style={{ flex: 1 }}
					onContextCreate={async (gl) => {
						const scene = new THREE.Scene();
						const camera = new THREE.PerspectiveCamera(
							75,
							gl.drawingBufferWidth / gl.drawingBufferHeight,
							0.1,
							2000
						);
						camera.position.z = zoomLevel.current;
						cameraRef.current = camera;

						const renderer = new Renderer({ gl });
						renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

						// Lights
						const light = new THREE.DirectionalLight(0xffffff, 1);
						light.position.set(0, 0, 10);
						scene.add(light);
						scene.add(new THREE.AmbientLight(0xffffff, 0.5));

						// Load model
						try {
							const model = await loadAsync(
								require('@/assets/models/kitchen.glb')
							);
							model.scene.scale.set(1, 1, 1);
							modelRef.current = model.scene;
							scene.add(model.scene);
						} catch (error) {
							console.error('Failed to load model:', error);
						} finally {
							setIsLoading(false);
						}

						const render = () => {
							requestAnimationFrame(render);
							renderer.render(scene, camera);
							gl.endFrameEXP();
						};
						render();
					}}
				/>
				{isLoading && (
					<View style={styles.loadingOverlay}>
						<ActivityIndicator size="large" color="#fff" />
						<Text style={styles.loadingText}>Loading 3D model...</Text>
					</View>
				)}
				<View className=" absolute bottom-5 left-0 right-0">
					<Grid
						className="gap-5 flex-1"
						_extra={{
							className: 'grid-cols-12',
						}}>
						<GridItem
							className="px-4"
							_extra={{
								className: 'col-span-6',
							}}>
							<Button
								className=" bg-gray-500"
								size="lg"
								onPress={() => rotateModel('y', -0.1)}>
								<ButtonText>Rotate Left</ButtonText>
							</Button>
						</GridItem>
						<GridItem
							className="px-4"
							_extra={{
								className: 'col-span-6',
							}}>
							<Button
								className=" bg-yellow-500"
								size="lg"
								onPress={() => rotateModel('y', 0.1)}>
								<ButtonText>Rotate Right</ButtonText>
							</Button>
						</GridItem>
						<GridItem
							className="px-4"
							_extra={{
								className: 'col-span-6',
							}}>
							<Button
								className="bg-orange-500"
								size="lg"
								onPress={() => rotateModel('x', -0.1)}>
								<ButtonText>Rotate Up</ButtonText>
							</Button>
						</GridItem>
						<GridItem
							className="px-4"
							_extra={{
								className: 'col-span-6',
							}}>
							<Button
								className="bg-red-400"
								size="lg"
								onPress={() => rotateModel('x', 0.1)}>
								<ButtonText>Rotate Down</ButtonText>
							</Button>
						</GridItem>
						<GridItem
							className="px-4"
							_extra={{
								className: 'col-span-6',
							}}>
							<Button className="" size="lg" onPress={() => zoomCamera(-2)}>
								<ButtonText>Zoom In</ButtonText>
							</Button>
						</GridItem>
						<GridItem
							className="px-4"
							_extra={{
								className: 'col-span-6',
							}}>
							<Button
								className="bg-orange-600"
								size="lg"
								onPress={() => zoomCamera(2)}>
								<ButtonText>Zoom Out</ButtonText>
							</Button>
						</GridItem>
					</Grid>
				</View>
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
