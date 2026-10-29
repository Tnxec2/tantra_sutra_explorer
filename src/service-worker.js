import { clientsClaim } from "workbox-core"
import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching"
import { NavigationRoute, registerRoute } from "workbox-routing"

clientsClaim()

// Workbox replaces this injection point with the production precache manifest.
// eslint-disable-next-line no-restricted-globals
precacheAndRoute(self.__WB_MANIFEST)

const navigationHandler = createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`)
registerRoute(
  new NavigationRoute(navigationHandler, {
    denylist: [/\/[^/?]+\.[^/]+$/],
  })
)
