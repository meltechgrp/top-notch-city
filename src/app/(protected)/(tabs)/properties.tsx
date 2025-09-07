import { FilterComponent } from "@/components/admin/shared/FilterComponent";
import MainLayout from "@/components/admin/shared/MainLayout";
import { openAccessModal } from "@/components/globals/AuthModals";
import VerticalProperties from "@/components/property/VerticalProperties";
import {
  Button,
  ButtonText,
  Heading,
  Icon,
  Image,
  Pressable,
  Text,
  View,
} from "@/components/ui";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useStore } from "@/store";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { useLayout } from "@react-native-community/hooks";
import { useRouter } from "expo-router";
import { MoveRight, Plus } from "lucide-react-native";
import { useMemo, useState } from "react";

export default function PropertiesScreen() {
  const router = useRouter();
  const { me, hasAuth } = useStore();
  const [ctaVisible, setCtaVisible] = useState(false);
  const [ctaType, setCtaType] = useState<"agent" | "admin" | "user">("user");
  const [search, setSearch] = useState("");
  const [actveTab, setActiveTab] = useState("all");
  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityQueries({ type: "user", profileId: me?.id });
  const list = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
  const filteredData = useMemo(() => {
    let filtered = list;

    if (actveTab !== "all") {
      filtered = filtered.filter((u) => u.status.toLowerCase() === actveTab);
    }
    if (search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      filtered = filtered.filter(
        (u) =>
          regex.test(u.category?.name) ||
          regex.test(u.subcategory?.name) ||
          regex.test(u.purpose) ||
          regex.test(u.price.toString()) ||
          regex.test(u.status) ||
          regex.test(u.address.city) ||
          regex.test(u.address.state)
      );
    }
    return filtered;
  }, [list, search, actveTab]);
  const tabs = useMemo(() => {
    const all = list.length;
    const rejected = list.filter((item) => item.status == "rejected").length;
    const approved = list.filter((item) => item.status === "approved").length;
    const pending = list.filter((item) => item.status === "pending").length;
    const sold = list.filter((item) => item.status === "sold").length;
    const flagged = list.filter((item) => item.status === "flagged").length;

    return [
      { title: "all", total: all },
      { title: "pending", total: pending },
      { title: "approved", total: approved },
      { title: "sold", total: sold },
      { title: "rejected", total: rejected },
      { title: "flagged", total: flagged },
    ];
  }, [list]);

  const headerComponent = useMemo(() => {
    return (
      <FilterComponent
        search={search}
        onSearch={setSearch}
        tabs={tabs}
        tab={actveTab}
        onUpdate={setActiveTab}
        searchPlaceholder="Search by location, category or price "
      />
    );
  }, [search, setSearch, tabs, actveTab]);
  useRefreshOnFocus(refetch);

  const isAdmin = useMemo(() => me?.role == "admin" || me?.is_superuser, [me]);
  function handleGetStarted() {
    console.log("here");
    if (!hasAuth) {
      // Not logged in — show CTA to become an agent
      setCtaType("user");
      return setCtaVisible(true);
    }

    if (me?.role === "agent") {
      return router.push("/property/add");
    }

    if (isAdmin) {
      // Show warning modal
      setCtaType("admin");
      return setCtaVisible(true);
    }

    // For any other role, show CTA to become an agent
    setCtaType("agent");
    setCtaVisible(true);
  }
  const { onLayout, height } = useLayout();
  return (
    <>
      <MainLayout
        isAgent
        showNotification={false}
        onLayout={onLayout}
        className="pt-4 px-2"
        rightHeaderComponent={
          filteredData?.length > 0 ? (
            <Pressable
              onPress={handleGetStarted}
              both
              className="flex-row items-center gap-1 p-1.5 px-3 rounded-xl bg-primary"
            >
              <Text className="text-white">Add</Text>
              <Icon size="sm" as={Plus} className="text-white" />
            </Pressable>
          ) : (
            <></>
          )
        }
      >
        <VerticalProperties
          isLoading={isLoading}
          data={filteredData}
          showStatus={true}
          headerTopComponent={
            filteredData.length > 0 ? headerComponent : undefined
          }
          onPress={(data) => {
            router.push({
              pathname: "/property/[propertyId]",
              params: {
                propertyId: data.id,
              },
            });
          }}
          refetch={async () => await refetch()}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          className="pb-24"
          ListEmptyComponent={
            <View className="flex-1 gap-8">
              <View
                style={{ height: height / 1.3 }}
                className="flex-1 min-h-96 rounded-3xl overflow-hidden"
              >
                <Image
                  source={require("@/assets/images/landing/agent.png")}
                  alt="sell banner"
                  className={`object-cover object-bottom w-full flex-1 rounded-3xl`}
                />
              </View>
              <View className="bg-background-muted rounded-xl p-6 px-4 mx-4">
                <Heading size="xl" className="text-center">
                  Ready to List Your Property?
                </Heading>
                <Text size="sm" className="font-light text-center mb-4 mt-2">
                  Easily list your property, add details, photos, and reach
                  thousands of potential buyers or renters.
                </Text>
                <Button
                  onPress={handleGetStarted}
                  size="xl"
                  className="mt-6 self-center mx-auto rounded-md"
                >
                  <ButtonText className="text-md">Get Started</ButtonText>
                  <Icon size="xl" as={MoveRight} className="text-white" />
                </Button>
              </View>
            </View>
          }
        />
      </MainLayout>
      {ctaVisible && (
        <View className="absolute inset-0 bg-black/40 justify-center items-center z-50">
          <View className="bg-background-muted rounded-xl w-11/12 max-w-md p-6 gap-y-4">
            <Heading size="lg" className="text-center">
              {ctaType === "user"
                ? "Interested in Becoming an Agent?"
                : ctaType === "agent"
                  ? "Ready to Start Listing Properties?"
                  : "Access Restricted"}
            </Heading>

            <Text className="text-center text-sm">
              {ctaType === "user"
                ? "To list properties, please sign in with an agent account or create one to get started."
                : ctaType === "agent"
                  ? "You're almost there! Complete your agent registration to begin listing properties."
                  : "Administrators are not permitted to list properties. Please switch to an agent account to proceed."}
            </Text>

            <View className="flex-row justify-center gap-4 mt-6">
              <Button
                variant="outline"
                className="flex-1 h-12"
                onPress={() => setCtaVisible(false)}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>

              {(ctaType === "user" || ctaType === "agent") && (
                <Button
                  className="flex-1 h-12"
                  onPress={() => {
                    openAccessModal({ visible: true });
                  }}
                >
                  <ButtonText>
                    {ctaType === "user" ? "Sign In" : "Become Agent"}
                  </ButtonText>
                </Button>
              )}
            </View>
          </View>
        </View>
      )}
    </>
  );
}
