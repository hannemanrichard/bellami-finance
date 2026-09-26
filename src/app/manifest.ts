import type { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => {
  return {
    name: "bellami-finance",
    short_name: "bellami-finance",
    description: "Record expenses in bellami-finance",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F4F8FB",
    theme_color: "#E4EDF5",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
};

export default manifest;
