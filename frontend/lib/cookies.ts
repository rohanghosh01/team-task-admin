import Cookies from "js-cookie";

// Set a cookie with options
export function setCookie(name: string, value: string, options = {}): void {
  Cookies.set(name, value, {
    expires: 1, // Default to 1 day
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    ...options,
  });
}

// Get a cookie by name
export function getCookie(name: string): string | undefined {
  return Cookies.get(name);
}

// Delete a cookie by name
export function deleteCookie(name: string): void {
  Cookies.remove(name);
}
