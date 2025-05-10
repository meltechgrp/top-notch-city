import { cn } from '@/lib/utils';
import React, { useImperativeHandle, useMemo } from 'react';
import {
	Keyboard,
	Pressable,
	TextInput,
	TextInputProps,
	View,
} from 'react-native';
import { CameraIcon, Send } from 'lucide-react-native';
// import MediaPicker, { MediaPickerRef } from '@/components/feed/MediaPicker'
// import type { ImagePickerAsset } from 'expo-image-picker'

// export type EditorOnchangeArgs = { text: string; files: ImagePickerAsset[] }
type Props = View['props'] & {
	onBlur?: () => void;
	onSend: (arg: any) => void;
	onUpdate?: (arg: any) => void;
	fileLimit?: number;
	placeholder?: string;
	commentId?: string | null;
	value?: string;
	mentions?: {
		id: string;
		content: string;
		position: number;
	}[];
	headerComponent?: React.ReactNode;
	noMedia?: boolean;
};

export type EditorComponentRefHandle = Pick<TextInput, 'focus'> & {
	setText: React.Dispatch<React.SetStateAction<string>>;
};

const EditorComponent = React.forwardRef<
	EditorComponentRefHandle,
	TextInputProps & Props
>((props, ref) => {
	const {
		style,
		placeholder,
		onSend,
		onUpdate,
		commentId,
		onBlur,
		className,
		headerComponent,
		fileLimit = 3,
		autoFocus,
		value = '',
		noMedia,
	} = props;
	const mediaPickerRef = React.useRef<any>(null);
	const [text, setText] = React.useState(value);
	const [media, setMedia] = React.useState<any[]>([]);
	const textInputRef = React.useRef<TextInput>(null);
	const isComposing = useMemo(() => {
		return text.length > 0 || media.length > 0;
	}, [text, media]);

	function onSubmit() {
		if (!text.trim() && media.length === 0) return;
		onSend({ text: text.length !== 0 ? text : ' ', files: media });
		setText('');
		setMedia([]);
	}
	React.useEffect(() => {
		if (onUpdate) {
			onUpdate({ text, files: media });
		}
	}, [text]);
	React.useEffect(() => {
		if (commentId && textInputRef) {
			textInputRef.current?.focus();
		}
	}, [commentId]);
	useImperativeHandle(ref, () => {
		return {
			focus() {
				Keyboard.dismiss();
				textInputRef.current?.focus();
			},
			setText,
		};
	}, []);
	return (
		<View
			className={cn('w-full relative border-t border-t-outline', className)}>
			{headerComponent}
			{/* <MediaPicker
        ref={mediaPickerRef as any}
        max={fileLimit}
        media={media}
        onChange={setMedia}
        className="px-4 pt-4"
      /> */}

			<View className={cn('w-full px-4 pt-3 pb-2', style)}>
				<View className="flex-row">
					{!noMedia && (
						<View className="flex-row items-end">
							<Pressable
								className={cn(
									'h-12 w-12 items-center justify-center rounded-xl disabled:opacity-50'
								)}
								onPress={() => mediaPickerRef.current?.onPickPhoto?.()}
								disabled={media.length >= fileLimit}>
								<CameraIcon className="text-primary" />
							</Pressable>
						</View>
					)}

					<View className="flex-row items-center p-2  flex-1">
						<TextInput
							ref={textInputRef}
							autoFocus={autoFocus}
							onBlur={() => {
								if (text.length === 0) {
									onBlur?.();
								}
							}}
							value={text}
							onChangeText={setText}
							className="flex-1 max-h-[100px]"
							multiline={true}
							placeholder={placeholder}
							placeholderTextColor={'#A0AEC0'}
						/>
					</View>

					<View className="flex-row items-end pl-2 gap-x-4">
						<Pressable
							className={cn(
								'bg-primary h-12 w-12 items-center justify-center rounded-xl',
								!isComposing && 'opacity-50'
							)}
							onPress={onSubmit}>
							<Send color={'white'} />
						</Pressable>
					</View>
				</View>
			</View>
		</View>
	);
});

export default EditorComponent;
