import { Avatar, Box, Heading, Icon, Text, View } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Images } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import ListingPhotosBottomSheet from "./ListingPhotosBottomSheet";
import { useTempStore } from "@/store";
import ListingVideosBottomSheet from "./ListingVideosBottomSheet";

export default function ListingMediaFiles() {
  const { listing, updateListing } = useTempStore();
  const [photosBottomSheet, setPhotosBottomSheet] = useState(false);
  const [videosBottomSheet, setVideosBottomSheet] = useState(false);
  const [modelBottomSheet, setModelBottomSheet] = useState(false);

  return (
    <>
      <Box className="flex-1 py-4 px-4">
        <View className=" flex-1 py-6 gap-4">
          <Heading size="md" className="text-center">
            Bring Your Property to Life with Photos and Video
          </Heading>
          <View className="py-4 gap-5">
            <TouchableOpacity
              className=" h-20"
              onPress={() => setPhotosBottomSheet(true)}
            >
              <View
                className={cn(
                  " gap-4 p-6 py-3 flex-row items-center rounded-2xl border border-outline-300",
                  listing.photos &&
                    listing.photos.length > 0 &&
                    "border border-primary"
                )}
              >
                <Icon as={Images} className="text-primary" />
                <Text>Upload photos</Text>
                <Avatar className=" ml-auto">
                  <Text size="lg" className="text-white">
                    {(listing?.photos ? listing?.photos.length : 0).toString()}
                  </Text>
                </Avatar>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className=" h-20"
              onPress={() => setVideosBottomSheet(true)}
            >
              <View
                className={cn(
                  " gap-4 p-6 py-3 flex-row items-center rounded-2xl border border-outline-300",
                  listing.videos &&
                    listing.videos.length > 0 &&
                    "border border-primary"
                )}
              >
                <Icon as={Images} className="text-primary" />
                <Text>Upload videos</Text>
                <Avatar className=" ml-auto">
                  <Text size="lg" className="text-white">
                    {listing?.videos ? listing?.videos.length : 0}
                  </Text>
                </Avatar>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity className=" h-20" onPress={() => {}}>
							<View
								className={cn(
									' gap-4 p-6 py-3 flex-row items-center rounded-2xl border border-outline-300',
									listing.modelImages &&
										listing.modelImages.length > 0 &&
										'border border-primary'
								)}>
								<Icon as={Images} className="text-primary" />
								<Text>Create a 3D visual tour</Text>
								<Avatar className=" ml-auto">
									<Text size="lg" className="text-white">
										{listing?.modelImages ? listing?.modelImages.length : 0}
									</Text>
								</Avatar>
							</View>
						</TouchableOpacity> */}
          </View>
        </View>
        <ListingPhotosBottomSheet
          visible={photosBottomSheet}
          photos={listing.photos}
          onDismiss={() => setPhotosBottomSheet(false)}
          deleteFile={(id) => {
            let newData = listing.photos?.filter((_, i) => i + 1 != id);
            updateListing({ ...listing, photos: newData });
          }}
          deleteAllFile={() => updateListing({ ...listing, photos: [] })}
          onUpdate={async (data) => {
            let combined = [...(listing.photos ?? []), ...data];
            updateListing({ ...listing, photos: combined });
          }}
        />
        <ListingVideosBottomSheet
          deleteFile={(id) => {
            let newData = listing.videos?.filter((_, i) => i + 1 != id);
            updateListing({ ...listing, videos: newData });
          }}
          deleteAllFile={() => updateListing({ ...listing, videos: [] })}
          onUpdate={async (data) => {
            let combined = [...(listing.videos ?? []), ...data];
            updateListing({ ...listing, videos: combined });
          }}
          visible={videosBottomSheet}
          videos={listing.videos}
          onDismiss={() => setVideosBottomSheet(false)}
        />
      </Box>
    </>
  );
}
