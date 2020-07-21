import fetch from 'node-fetch'

class HarperDBServiceError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'HarperDBServiceError'
	}
}

class HarperDBService {
	private dbUrl = process.env.HDB_URL || ''

	private authorizations = {
		auth_bot: Buffer.from('auth_bot:RyseSBynCL4d').toString('base64')
	}

	public async createUser (username: string, password: string) {
		const res = await fetch(this.dbUrl, {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				'authorization': `Basic ${this.authorizations.auth_bot}`
			},
			body: JSON.stringify({
				operation: 'add_user',
				role: '2cd31f45-a802-403e-a25f-9bf9f63e17e9',
				username,
				password,
				active: true
			})
		})

		const body = await res.json()
		if (res.ok) {
			return body
		} else {
			throw new HarperDBServiceError(body.error)
		}
	}

	public async getUser (token: string) {
		const res = await fetch(this.dbUrl, {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				'authorization': `Basic ${token}`
			},
			body: JSON.stringify({
				operation: 'user_info'
			})
		})

		const body = await res.json()
		if (res.ok) {
			return body
		} else {
			throw new HarperDBServiceError(body.error)
		}
	}

	public async createResearcher (token: string, username: string, profile: { email: string }) {
		const res = await fetch(this.dbUrl, {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				authorization: `Basic ${token}`
			},
			body: JSON.stringify({
				operation: 'insert',
				schema: 'dev',
				table: 'researchers',
				records: [
					{
						username,
						...profile
					}
				]
			})
		})

		const body = await res.json()
		if (res.ok) {
			return body
		} else {
			throw new HarperDBServiceError(body.error)
		}
	}

	public async updateResearcher (token: string, username: string, profile: { email: string }) {
		const res = await fetch(this.dbUrl, {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				authorization: `Basic ${token}`
			},
			body: JSON.stringify({
				operation: 'update',
				schema: 'dev',
				table: 'researchers',
				records: [
					{
						username,
						...profile
					}
				]
			})
		})

		const body = await res.json()
		if (res.ok) {
			return body
		} else {
			throw new HarperDBServiceError(body.error)
		}
	}

	public async readResearcher (token: string, username: string) {
		const res = await fetch(this.dbUrl, {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				authorization: `Basic ${token}`
			},
			body: JSON.stringify({
				operation: 'search_by_hash',
				schema: 'dev',
				table: 'researchers',
				hash_values: [ username ],
				get_attributes: [ '*' ]
			})
		})

		const body = await res.json()
		if (res.ok) {
			return body
		} else {
			throw new HarperDBServiceError(body.error)
		}
	}

	public async createPost (token: string, username: string, post: {
		content: string,
		anonymous: boolean
	}) {
		const res = await fetch(this.dbUrl, {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				authorization: `Basic ${token}`
			},
			body: JSON.stringify({
				operation: 'insert',
				schema: 'dev',
				table: 'posts',
				records: [
					{
						researcher: username,
						content: post.content,
						anonymous: post.anonymous
					}
				]
			})
		})

		const body = await res.json()
		if (res.ok) {
			return body
		} else {
			throw new HarperDBServiceError(body.error)
		}
	}

	public async updatePost (token: string, id: string, post: {
		content: string,
		anonymous: boolean
	}) {
		const res = await fetch(this.dbUrl, {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				authorization: `Basic ${token}`
			},
			body: JSON.stringify({
				operation: 'update',
				schema: 'dev',
				table: 'posts',
				records: [
					{
						id,
						content: post.content,
						anonymous: post.anonymous
					}
				]
			})
		})

		const body = await res.json()
		if (res.ok) {
			return body
		} else {
			throw new HarperDBServiceError(body.error)
		}
	}

	public async readPost (token: string, id: string) {
		const res = await fetch(this.dbUrl, {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				authorization: `Basic ${token}`
			},
			body: JSON.stringify({
				operation: 'search_by_hash',
				schema: 'dev',
				table: 'posts',
				hash_values: [ id ],
				get_attributes: [ '*' ]
			})
		})

		const body = await res.json()
		if (res.ok) {
			return body
		} else {
			throw new HarperDBServiceError(body.error)
		}
	}

	public async getPosts (token: string) {
		const res = await fetch(this.dbUrl, {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				authorization: `Basic ${token}`
			},
			body: JSON.stringify({
				operation: 'search_by_value',
				schema: 'dev',
				table: 'posts',
				search_attribute: 'id',
				search_value: '*',
				get_attributes: [ '*' ]
			})
		})

		const body = await res.json()
		if (res.ok) {
			return body
		} else {
			throw new HarperDBServiceError(body.error)
		}
	}
}

export default HarperDBService