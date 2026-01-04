import { fetchProperty } from "@/actions/property";
import { getUser } from "@/actions/user";

export function parseQRCodeLink(url: string) {
  try {
    const parsed = new URL(url);

    if (url.includes("topnotchcity.com")) {
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (segments[0] === "agents") {
        return {
          type: "agent",
          slug: segments[1],
          deepLink: `/agents/${segments[1]}`,
        };
      }

      if (segments[0] === "properties") {
        const slug = segments.slice(1).join("/");
        return {
          type: "property",
          slug,
          deepLink: `/properties/${slug}`,
        };
      }

      return { type: "external", webUrl: url };
    }
    return { type: "external", webUrl: url };
  } catch {
    return { type: "external", webUrl: url };
  }
}

export async function fetchPreview(parsed: any): Promise<{
  type: "agent" | "property";
  data: any;
} | null> {
  if (parsed.type === "agent") {
    const agent = await getUser(parsed.slug);
    return { type: "agent", data: agent };
  }

  if (parsed.type === "property") {
    const property = await fetchProperty({ id: parsed.slug });
    return { type: "property", data: property };
  }

  return null;
}
