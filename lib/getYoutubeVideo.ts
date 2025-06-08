export function getYouTubeVideoID(url: string) {
  const urlParams = new URL(url).searchParams;
  return urlParams.get("v");
}
