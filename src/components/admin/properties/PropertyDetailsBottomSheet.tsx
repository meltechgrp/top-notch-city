import { View } from "react-native";
import {
  Badge,
  BadgeText,
  Button,
  Heading,
  Icon,
  Pressable,
  Text,
} from "@/components/ui";
import withRenderVisible from "@/components/shared/withRenderOpen";
import { composeFullAddress, formatMoney, fullName } from "@/lib/utils";
import { capitalize, chunk } from "lodash-es";
import BottomSheet from "@/components/shared/BottomSheet";
import { PropertyStatus } from "@/components/property/PropertyStatus";
import { useState } from "react";
import { useLayout } from "@react-native-community/hooks";
import { PropertyMedia } from "@/components/property/PropertyMedia";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { format } from "date-fns";
import { Check, MoreHorizontal } from "lucide-react-native";
import { PropertyModalMediaViewer } from "@/components/modals/property/PropertyModalMediaViewer";
import PropertyActionsBottomSheet from "@/components/modals/property/PropertyActionsBottomSheet";
import { usePropertyActions } from "@/hooks/usePropertyActions";

type PropertyBottomSheetProps = {
  visible: boolean;
  property: Property;
  user: Me;
  onDismiss: () => void;
};

function PropertyDetailsBottomSheet(props: PropertyBottomSheetProps) {
  const { visible, property, onDismiss } = props;
  const [isViewer, setIsViewer] = useState(false);
  const [imageIndex, setImagesIndex] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const { width, onLayout } = useLayout();
  const { actions } = usePropertyActions({ property });
  const HeaderRightComponent = (
    <Button
      onPress={() => {
        setOpenEdit(true);
      }}
      className=" self-end bg-gray-600 "
    >
      <Icon size="xl" as={MoreHorizontal} className=" text-white" />
    </Button>
  );
  return (
    <BottomSheet
      title="Review"
      onDismiss={onDismiss}
      visible={visible}
      withHeader
      HeaderRightComponent={HeaderRightComponent}
      withScroll={true}
      snapPoint={[450, 720]}
    >
      <View onLayout={onLayout} className="gap-y-4 flex-1 mt-4 px-4 pb-32">
        <View className=" rounded-2xl bg-background-muted p-4">
          <View className="flex-row justify-between">
            <Heading size="md" className="mb-3">
              Property Info
            </Heading>
          </View>

          <View className="gap-y-3">
            <InfoRow
              label="Price"
              value={formatMoney(property.price, property.currency, 0)}
            />
            <InfoRow label="Purpose" value={capitalize(property.purpose)} />
            <View className="flex-row justify-between py-1">
              <Text className="text-sm">Status:</Text>
              <PropertyStatus status={property.status} />
            </View>
            <InfoRow label="Category" value={capitalize(property.category)} />
            <InfoRow
              label="Subcategory"
              value={capitalize(property.subcategory)}
            />
            <InfoRow
              label="Address"
              value={composeFullAddress(property.address, true, "long")}
            />
            <InfoRow
              label="Created"
              value={format(
                new Date(property?.created_at ?? new Date()),
                "dd MMM yyyy"
              )}
            />
          </View>
        </View>
        <View className="bg-background-muted rounded-2xl p-4 shadow-sm">
          <Heading size="md" className="mb-3">
            Description
          </Heading>
          <View className=" min-h-20">
            <Text numberOfLines={5}>{property?.description || "N/A"}</Text>
          </View>
        </View>
        <View className="bg-background-muted min-h-32 rounded-2xl p-4 shadow-sm">
          <Heading size="md" className="mb-3">
            Media
          </Heading>
          <View className="flex-wrap gap-4">
            {chunk(property?.media, 4).map((row, i) => (
              <View className={"flex-row gap-4"} key={i}>
                {row.map((media, i) => (
                  <Pressable key={media.id}>
                    <PropertyMedia
                      style={{
                        width: width > 100 ? (width - 100) / 4 : 72,
                        height: width > 100 ? (width - 100) / 4 : 72,
                      }}
                      rounded
                      className={" bg-background-muted"}
                      source={media}
                      canPlayVideo={false}
                      onPress={() => {
                        setImagesIndex(i);
                        setIsViewer(true);
                      }}
                    />
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </View>
        <View className="bg-background-muted rounded-2xl p-4 shadow-sm">
          <Heading size="md" className="mb-3">
            Owner
          </Heading>
          <View className="">
            <InfoRow label="Name" value={fullName(property.owner)} />
            <InfoRow label="Email" value={property.owner?.email ?? "N/A"} />
          </View>
        </View>
        {property.amenities.length > 0 && (
          <View className="bg-background-muted rounded-2xl p-4 shadow-sm">
            <Heading size="md" className="mb-3">
              Amenities
            </Heading>
            <View className="flex-row gap-4 justify-between flex-wrap">
              {property.amenities.map((a) => (
                <Badge
                  size="lg"
                  variant="solid"
                  className="bg-background px-3 py-1.5 gap-2"
                  key={a.name}
                >
                  <BadgeText className=" capitalize">{a.name}</BadgeText>
                  {parseInt(a.value) > 0 ? (
                    <Text className="text-primary">{a.value}</Text>
                  ) : (
                    <Icon size="sm" className="text-primary" as={Check} />
                  )}
                </Badge>
              ))}
            </View>
          </View>
        )}
      </View>

      <PropertyModalMediaViewer
        width={width}
        selectedIndex={imageIndex}
        visible={isViewer}
        setVisible={setIsViewer}
        canPlayVideo
        media={property?.media}
      />
      <PropertyActionsBottomSheet
        isOpen={openEdit}
        onDismiss={() => setOpenEdit(false)}
        withBackground={false}
        options={actions.filter((action) => action.visible)}
        OptionComponent={({ index, option, onPress }) => (
          <ConfirmationModal
            key={index}
            visible={option.visible}
            index={index}
            header={option.header}
            description={option.description}
            actionText={option.actionText}
            requireReason={option.requireReason}
            onConfirm={option.onConfirm}
            propertyId={property.id}
            className={option.className}
            onDismiss={onDismiss}
            onPress={onPress}
          />
        )}
      />
    </BottomSheet>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2">
      <Text className="text-sm">{label}:</Text>
      <Text className="text-sm text-right max-w-[60%]">{value}</Text>
    </View>
  );
}

export default withRenderVisible(PropertyDetailsBottomSheet);
