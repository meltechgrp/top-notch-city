import { Fetch } from "../utills";

export async function getReview({ review_id }: { review_id: string }) {
  const res = await Fetch(`/reviews/${review_id}`);
  if (res?.detail) throw Error("Failed to fetch review");
  return res as Review;
}

export async function getAgentReviews({ agent_id }: { agent_id: string }) {
  const res = await Fetch(`/agents/${agent_id}/all-reviews`);
  if (res?.detail) throw Error("Failed to fetch agent reviews");
  return res as Review[];
}

export async function sendReview({
  form,
}: {
  form: Omit<Review, "id" | "created_at" | "updated_at" | "user_id">;
}) {
  const res = await Fetch(`/agents/${form.agent_id}review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: { rating: form.rating, comment: form.comment },
  });
  if (res?.detail) throw Error("Failed to send review");
  return res as Review;
}

export async function updateReview({
  review_id,
  form,
}: {
  review_id: string;
  form: Partial<Pick<Review, "rating" | "comment">>;
}) {
  const res = await Fetch(`/reviews/${review_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: form,
  });
  if (res?.detail) throw Error("Failed to update review");
  return res as Review;
}

export async function deleteReview({ review_id }: { review_id: string }) {
  const res = await Fetch(`/reviews/${review_id}`, {
    method: "DELETE",
  });
  if (res?.detail) throw Error("Failed to delete review");
  return res as { message: string };
}
