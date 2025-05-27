import { createDirectus, rest, staticToken } from "@directus/sdk";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const accessToken = process.env.ACCESS_TOKEN;

const directus = createDirectus(apiUrl as string)
  .with(staticToken(accessToken as string))
  .with(rest());

export default directus;
