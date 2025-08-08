import { Fetch } from "@/actions/utills";
import config from "@/config";
import { getAuthToken } from "@/lib/secureStore";
import { getUniqueIdSync } from "react-native-device-info";

export async function startChat({
  property_id,
  message,
}: {
  property_id: string;
  message: string;
}) {
  const authToken = getAuthToken();
  const deviceId = getUniqueIdSync();
  const result = await fetch(
    `${config.origin}/api/chat/start?property_id=${property_id}`,
    {
      method: "POST",
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        "X-DID": deviceId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([property_id]),
    }
  );
  const res = await result.json();
  console.log(res);
  if (!res.ok) throw Error("error");
  return res;
}
