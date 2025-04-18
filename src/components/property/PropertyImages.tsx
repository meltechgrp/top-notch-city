import { Image } from '@/components/ui';
import { Grid, GridItem } from '../ui/grid';

type Props = {
	images: { path: any }[];
};

export default function PropertyImages({ images }: Props) {
	return (
		<Grid
			className="gap-4"
			_extra={{
				className: 'grid-cols-3',
			}}>
			{images.map((image, i) => (
				<GridItem
					className="w-full aspect-square"
					_extra={{
						className: '',
					}}
					key={i + 'a'}>
					<Image
						source={image.path}
						alt="Property Image"
						className="flex-1 w-full h-full"
					/>
				</GridItem>
			))}
		</Grid>
	);
}
