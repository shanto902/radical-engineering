// app/head.tsx
export default function Head() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="#000000"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="#ffffff"
      />

      <title>Radical Engineering</title>
      <meta name="description" content="Engineering made easy" />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
