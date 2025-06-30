import { Fetch } from "../utills";



// 🏠 Fetch all top locations 
export async function fetchTopLocations() {
    try {
        const res = await Fetch(`/top/cities`, {});
        if (res?.detail) throw new Error('Failed to top locations');
        return res as TopLocation[];
    } catch (error) {
        console.error(error);
        throw new Error('Failed to top locations');
    }
}

export async function fetchLocationProperties({ pageParam, location }: { pageParam: number, location?: string }) {
	try {
		const res = await Fetch(`/properties/city/${location}?page=${pageParam}`, {});
		if (res?.detail) throw new Error('Failed to fetch location data');
		return res as Result;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to fetch location data');
	}
}