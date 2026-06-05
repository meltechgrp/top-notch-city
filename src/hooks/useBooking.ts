import { Bookings, updateBookingStatus } from "@/actions/bookings";
import { getApiErrorMessage } from "@/actions/utills";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { useMe } from "@/hooks/useMe";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";

type BookingInfiniteData = {
  pages: BookingResult[];
  pageParams: unknown[];
};

function patchBookingStatus(
  data: BookingInfiniteData | undefined,
  bookingId: string,
  status: BookingStatus,
  note?: string,
  updatedAt?: string,
) {
  if (!data?.pages) return data;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      results: page.results.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status,
              notes: note ?? booking.notes,
              updated_at: updatedAt ?? booking.updated_at,
            }
          : booking,
      ),
    })),
  };
}

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
        (b) => b.booking_type === "reservation" && b.status === "pending",
      ),
      inspPending: unique.filter(
        (b) => b.booking_type === "inspection" && b.status === "pending",
      ),
      revList: unique.filter((b) => b.booking_type === "reservation"),
      inspList: unique.filter((b) => b.booking_type === "inspection"),
    };
  }, [data]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateBookingStatus,
    onMutate: async ({ booking_id, status, note }) => {
      const queryKey = ["bookings", isAgent];

      await queryClient.cancelQueries({ queryKey });
      const previousData =
        queryClient.getQueryData<BookingInfiniteData>(queryKey);

      queryClient.setQueryData<BookingInfiniteData>(queryKey, (current) =>
        patchBookingStatus(current, booking_id, status, note),
      );

      return {
        previousData,
        queryKey,
      };
    },
    onSuccess: (response, variables) => {
      queryClient.setQueryData<BookingInfiniteData>(
        ["bookings", isAgent],
        (current) =>
          patchBookingStatus(
            current,
            variables.booking_id,
            response.status,
            response.notes ?? variables.note,
            response.updated_at,
          ),
      );
      handleInvalidate();
      showErrorAlert({
        title: "Booking updated successfully",
        alertType: "success",
      });
    },
    onError: (e, variables, context) => {
      console.log(e);
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }

      showErrorAlert({
        title: getApiErrorMessage(
          e,
          "The server could not update this booking. Please try again.",
        ),
        alertType: "error",
      });
    },
  });
  const updateStatus = async (
    bookingId: string,
    status: BookingStatus,
    note?: string,
  ): Promise<any> => {
    try {
      return await mutateAsync({
        booking_id: bookingId,
        status,
        note,
      });
    } catch {
      return undefined;
    }
  };

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
