import { putNotification } from "../notification/notification";


export async function authorizationFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, options);
    if (response.status === 200) {
        return response;
    }
    if (response.status === 500) {
        const errorText = await response.text();
        putNotification({ type: "error", message: `Server error: ${errorText}` });
        throw new Error(`Server error: ${errorText}`);
    }
    putNotification({ type: "error", message: `Unexpected response status: ${response.status}` });
    throw new Error(`Unexpected response status: ${response.status}`);
}

export async function authorizationFetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await authorizationFetch(url, options);
    const data = await response.json();
    return data as T;
}