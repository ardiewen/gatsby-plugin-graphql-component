import { components } from "~gatsby-plugin-graphql-component/async-requires"
import { transform } from "./transform"

// on client entry is called almost as a first lifecycle
export const onClientEntry = async () => {
  const loader = window.___loader

  const { loadPage } = loader

  const cache = new WeakMap()

  // patch query json result in loadPage
  loader.loadPage = async (...args) => {
    const result = await loadPage(...args)

    if (cache.has(result)) {
      return result
    }

    if (result && result.json && result.json.data) {
      result.json.data = await transform({
        json: result.json.data,
        load: ({ componentChunkName }) => {
          return components[componentChunkName]()
        },
      })

      cache.set(result, true)
    }

    return result
  }

  // call loader public method before gatsby core calls underlying private method later after this lifecycle
  // therefore our patched method would not be called
  // network calls are reused in loader internally, so the page won't be loaded twice
  // all other code in core uses this public method, so we should be safe
  return loader.loadPage(window.location.pathname)
}
