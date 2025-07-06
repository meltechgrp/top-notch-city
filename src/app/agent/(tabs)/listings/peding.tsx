import { Box, View } from "@/components/ui";
import { useMemo } from "react";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import VerticalProperties from "@/components/property/VerticalProperties";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function PendingProperties() {
  // useRefreshOnFocus(refetch);
  return (
    <>
      <Box className=" flex-1 px-2 pt-2">
        <View className="flex-1">
          {/* <VerticalProperties
						data={propertysData}
						isLoading={isLoading}
						disableHeader
						refetch={refetch}
					/> */}
        </View>
      </Box>
    </>
  );
}
