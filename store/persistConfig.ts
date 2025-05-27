// store/persistConfig.ts
export function saveToLocalStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
}

export function loadFromLocalStorage<T>(key: string): T | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : undefined;
  } catch {
    return undefined;
  }
}
