export const registerServiceWorker = (): void => {
  if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return

  window.addEventListener("load", () => {
    const serviceWorkerUrl = `${process.env.PUBLIC_URL}/service-worker.js`
    navigator.serviceWorker.register(serviceWorkerUrl).catch(error => {
      console.error("Service worker registration failed:", error)
    })
  })
}
