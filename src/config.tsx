import Head from "next/head";

const titleDefault = "Notty";
const url = "http://localhost:3000/";
const description =
  "A simple Kanban board app to help you stay organized anywhere.";
const author = "Juan Carlos Lucio";

export default function Header({ title = titleDefault }) {
  return (
    <Head>
      {/* Recommended Meta Tags */}
      <meta charSet="utf-8" />
      <meta httpEquiv="content-type" content="text/html" />
      <meta name="author" content={author} />
      <meta name="designer" content={author} />
      <meta name="publisher" content={author} />
      {/* Search Engine Optimization Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Kanban, board, notes, organization" />
      <meta name="robots" content="index,follow" />
      <meta name="distribution" content="web" />
      {/* 
      Facebook Open Graph meta tags
        documentation: https://developers.facebook.com/docs/sharing/opengraph */}
      <meta property="og:title" content={title} />
      <meta property="og:type" content="site" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content="/icons/share.png" />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={description} />
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      <link
        rel="apple-touch-icon"
        sizes="16x16"
        href="/icons/favicon-16x16.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="32x32"
        href="/icons/favicon-32x32.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/icons/apple-touch-icon.png"
      />
      <link rel="manifest" href="/manifest.webmanifest" />
      <link
        rel="mask-icon"
        color="#ffffff"
        href="/icons/safari-pinned-tab.svg"
      />
      <link rel="apple-touch-startup-image" href="/startup.png" />
      {/* Meta Tags for HTML pages on Mobile */}
      {/* <meta name="format-detection" content="telephone=yes"/>
        <meta name="HandheldFriendly" content="true"/>  */}
      <meta
        name="viewport"
        content="width=device-width, minimum-scale=1, initial-scale=1.0"
      />
      <meta name="theme-color" content="#00aba9" />
      <link rel="icon" href="/icons/favicon.ico" sizes="any" />
      <link rel="icon" href="/icons/favicon.svg" type="image/svg+xml" />
      {/* 
      Twitter Summary card
        documentation: https://dev.twitter.com/cards/getting-started
        Be sure validate your Twitter card markup on the documentation site. */}
      <meta name="twitter:card" content="summary" />
      {/* Microsoft Pinned Websites 
        documentation: https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/dn255024(v=vs.85)#msapplication-tileimage */}
      <meta
        name="msapplication-TileImage"
        content="/icons/mstile-144x144.png"
      />
      <meta
        name="msapplication-square70x70logo"
        content="/icons/mstile-70x70.png"
      />
      <meta
        name="msapplication-square150x150logo"
        content="/icons/mstile-150x150.png"
      />
      <meta
        name="msapplication-square144x144logo"
        content="/icons/mstile-144x144.png"
      />
      <meta
        name="msapplication-square310x310logo"
        content="/icons/mstile-310x310.png"
      />
    </Head>
  );
}
