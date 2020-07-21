export default function abortFetch (request: RequestInfo, opts?: RequestInit) {
	const controller = new AbortController()
	const signal = controller.signal
	return {
		abort: () => controller.abort(),
		ready: fetch(request, { ...opts, signal })
	}
}