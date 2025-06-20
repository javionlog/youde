export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname.startsWith('/api/')) {
      url.host = env.API_HOST
      url.pathname = url.pathname.replace(/^\/api/u, '')
      const newRequest = new Request(url.toString(), request)
      console.log('newRequest', newRequest)
      return fetch(newRequest)
    }
    return new Response(null, { status: 404 })
  }
} satisfies ExportedHandler<CloudflareBindings>
