import { Bookings, updateBookingStatus } from "@/actions/bookings";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { useMe } from "@/hooks/useMe";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";

export function useBooking() {
  const queryClient = useQueryClient();
  const { me, isAgent } = useMe();
  function handleInvalidate() {
    queryClient.invalidateQueries({
      queryKey: ["bookings", isAgent],
    });
  }
  const { data, isLoading, refetch, isRefetching, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["bookings", isAgent],
      queryFn: ({ pageParam = 1 }) => Bookings(isAgent, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page, pages } = lastPage;
        return page < pages ? page + 1 : undefined;
      },
      enabled: !!me,
    });
  const bookings = useMemo(() => {
    const all = data?.pages.flatMap((p) => p.results) ?? [];

    const map = new Map<string, Booking>();
    for (const b of all) {
      map.set(b.id, b);
    }

    const unique = Array.from(map.values());

    return {
      revPending: unique.filter(
        (b) => b.booking_type === "reservation" && b.status === "pending"
      ),
      inspPending: unique.filter(
        (b) => b.booking_type === "inspection" && b.status === "pending"
      ),
      revList: unique.filter((b) => b.booking_type === "reservation"),
      inspList: unique.filter((b) => b.booking_type === "inspection"),
    };
  }, [data]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      handleInvalidate();
      showErrorAlert({
        title: "Booking updated successfully",
        alertType: "success",
      });
    },
    onError: () => {
      showErrorAlert({
        title: "Something went wrong!",
        alertType: "error",
      });
    },
  });
  const updateStatus = (
    bookingId: string,
    status: BookingStatus,
    note?: string
  ): Promise<any> =>
    mutateAsync({
      booking_id: bookingId,
      status,
      note,
    });

  return {
    counts: {
      reservations: bookings.revPending.length,
      inspections: bookings.inspPending.length,
    },

    lists: {
      reservations: bookings.revList,
      inspections: bookings.inspList,
    },

    query: {
      isLoading,
      isRefetching,
      refetch,
      hasNextPage,
      fetchNextPage,
    },
    mutation: {
      updateStatus,
      isPending,
    },
    handleInvalidate,
  };
}
