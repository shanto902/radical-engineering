// lib/scrollState.ts
export const saveScrollPosition = (key: string, value: number) => {
  sessionStorage.setItem(`${key}-scroll-y`, value.toString());
};

export const getScrollPosition = (key: string) => {
  const val = sessionStorage.getItem(`${key}-scroll`);
  return val ? parseInt(val) : 0;
};

export const saveNativePage = (key: string, page: number) => {
  sessionStorage.setItem(`${key}-page`, String(page));
};

export const getNativePage = (key: string) => {
  const val = sessionStorage.getItem(`${key}-page`);
  return val ? parseInt(val) : 1;
};
