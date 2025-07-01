import {
	AlertCircleIcon,
	Box,
	Heading,
	View,
	FormControl,
	FormControlError,
	FormControlErrorText,
	FormControlErrorIcon,
	FormControlLabel,
	FormControlLabelText,
	Textarea,
	TextareaInput,
} from '@/components/ui';
import { useLayout } from '@react-native-community/hooks';
import { Input, InputField } from '@/components/ui/input';
import { useTempStore } from '@/store';
import { TextInput } from 'react-native';

export default function ListingBasis() {
	const { onLayout, height } = useLayout();
	const { listing, updateListing } = useTempStore();
	return (
		<>
			<Box onLayout={onLayout} className="flex-1 px-4">
				<View className=" py-6 gap-8">
					<Heading size="xl">Give your property a unique descriptions</Heading>
					<View className="gap-6">
						<FormControl isInvalid={false} size="lg" isRequired={false}>
							<FormControlLabel>
								<FormControlLabelText>Property title</FormControlLabelText>
							</FormControlLabel>
							<Input size="md" className="my-1 h-14 rounded-xl">
								<InputField
									type="text"
									placeholder="1 bedroom flat... or amazon estate..."
									value={listing.title}
									onChangeText={(text) =>
										updateListing({ ...listing, title: text })
									}
								/>
							</Input>
							<FormControlError>
								<FormControlErrorIcon as={AlertCircleIcon} />
								<FormControlErrorText>
									Atleast 6 characters are required.
								</FormControlErrorText>
							</FormControlError>
						</FormControl>
						<FormControl isInvalid={false} size="lg" isRequired={false}>
							<FormControlLabel>
								<FormControlLabelText>
									Property description
								</FormControlLabelText>
							</FormControlLabel>
							<Textarea size="md" className=" border border-outline">
								<TextareaInput
									multiline
									value={listing.description}
									onChangeText={(text) =>
										updateListing({ ...listing, description: text })
									}
									placeholder="Share some additional information about the property..."
								/>
							</Textarea>
							<FormControlError>
								<FormControlErrorIcon as={AlertCircleIcon} />
								<FormControlErrorText>
									Atleast 6 characters are required.
								</FormControlErrorText>
							</FormControlError>
						</FormControl>
						<FormControl isInvalid={false} size="lg" isRequired={false}>
							<FormControlLabel>
								<FormControlLabelText>Property price</FormControlLabelText>
							</FormControlLabel>
							<TextInput
								onChangeText={(val) =>
									updateListing({
										...listing,
										price: val,
									})
								}
								value={listing.price}
								placeholder="Property price"
								keyboardType="numeric"
								className=" h-14 border text-typography border-outline data-[focus=true]:border-primary px-4 rounded-xl"
							/>
						</FormControl>
					</View>
				</View>
			</Box>
		</>
	);
}
