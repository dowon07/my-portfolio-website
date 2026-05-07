const DEFAULT_DEV_API_BASE_URL = 'http://localhost:4000'

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

export function getApiBaseUrl() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()

  if (configuredBaseUrl) {
    return trimTrailingSlash(configuredBaseUrl)
  }

  if (process.env.NODE_ENV === 'development') {
    return DEFAULT_DEV_API_BASE_URL
  }

  return ''
}

export function buildApiUrl(pathname: string) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const baseUrl = getApiBaseUrl()

  return `${baseUrl}${normalizedPath}`
}