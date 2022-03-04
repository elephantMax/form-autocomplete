//check env example
const token = process.env.token

const URL = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party`

let controller = null

export const fetchData = async (query) => {
  if (controller) {
    controller.abort()
  }
  controller = new AbortController()
  const { signal } = controller
  if (!query) {
    controller.abort()
    return null
  }

  try {
    const response = await fetch(URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify({ query }),
      signal,
    })
    controller = null
    return await response.json()
  } catch (error) {
    return Promise.reject(error)
  }
}
