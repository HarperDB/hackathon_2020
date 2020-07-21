import fastify from 'fastify'
import cors from 'fastify-cors'

import HarperDBService from './HarperService'

import dotenv from 'dotenv'

dotenv.config()

declare module 'fastify' {
	interface FastifyInstance {
		authenticate: () => Promise<boolean>;
		hdb: HarperDBService
	}
}

interface Post {
	anonymous: boolean;
	content: string;
	id: string;
	researcher: string;
}

const server = fastify({ logger: { prettyPrint: true } })

server.register(cors, {
	origin: (origin, cb) => {
		//  Request from localhost will pass
		if (/localhost/.test(origin)) {
			cb(null, true)
			return
		}
		cb(new Error('Not allowed'), false)
	}
})

const hdb = new HarperDBService()

server.decorate('hdb', hdb)

server.get('/ping', async () => {
	return { message: 'pong' }
})

server.post<{
	Body: {
		email: string;
		username: string;
		password: string;
	}
}>('/sign-up', {
	schema: {
		body: {
			type: 'object',
			properties: {
				email: { type: 'string' },
				username: { type: 'string' },
				password: { type: 'string' }
			},
			required: [ 'username', 'password' ]
		}
	}
}, async (req, res) => {
	const email = req.body.email
	const username = req.body.username
	const password = req.body.password

	if (!username || !password) {
		res.code(400)
		return {
			message: 'Username and Password cannot be empty'
		}
	}

	const createUserRes = await server.hdb.createUser(username, password)
	if (createUserRes.message.match('successfully added')) {
		const token = Buffer.from(`${username}:${password}`).toString('base64')

		const createResearcherRes = await server.hdb.createResearcher(token, username, { email })

		if (createResearcherRes.message.match('inserted 1 of 1 records')) {
			return {
				token,
				username,
				profile: {
					email
				}
			}
		} else {
			res.code(400)
			return createResearcherRes
		}
	} else {
		res.code(400)
		return createUserRes
	}
})

server.post<{
	Headers: {
		'hdb-token': string;
	};
	Body: {
		username: string;
		profile: {
			email: string;
		};
	};
}>('/update-researcher', {
	schema: {
		headers: {
			type: 'object',
			properties: {
				'hdb-token': { type: 'string' }
			},
			required: [ 'hdb-token' ]
		},
		body: {
			type: 'object',
			properties: {
				username: { type: 'string' },
				profile: {
					type: 'object',
					properties: {
						email: { type: 'string' }
					},
					required: [ 'email' ]
				}
			},
			required: [ 'token', 'username', 'profile' ]
		}
	}
}, async (req, res) => {
	const token = req.headers['hdb-token']
	const username = req.body.username
	const profile = req.body.profile

	if (!token || !username) {
		res.code(400)
		return {
			message: 'User token and username are required'
		}
	} else if (!profile) {
		res.code(400)
		return {
			message: 'Must provide profile updates'
		}
	}

	const updateResearcherRes = await server.hdb.updateResearcher(token, username, profile)
	if (updateResearcherRes.message.match('updated 1 of 1 records')) {
		const getResearcherRes = await server.hdb.readResearcher(token, username)
		if (Array.isArray(getResearcherRes)) {
			return getResearcherRes[0]
		} else {
			res.code(400)
			return getResearcherRes
		}
	} else {
		res.code(400)
		return updateResearcherRes
	}

})

server.post<{
	Body: {
		username: string;
		password: string;
	}
}>('/sign-in', {
	schema: {
		body: {
			type: 'object',
			properties: {
				username: { type: 'string' },
				password: { type: 'string' }
			},
			required: [ 'username', 'password' ]
		}
	}
}, async (req, res) => {
	const username = req.body.username
	const password = req.body.password

	if (!username || !password) {
		res.code(400)
		return {
			message: 'Username and Password cannot be empty'
		}
	}

	const token = Buffer.from(`${username}:${password}`).toString('base64')
	try {
		const userInfo = await server.hdb.getUser(token)
		return userInfo
	} catch (error) {
		if (error.message === 'Login failed') {
			res.code(400)
			return {
				message: 'Invalid login, try again.'
			}
		} else {
			throw error
		}
	}
})

server.get<{
	Headers: {
		'hdb-token': string
	}
}>('/posts', {
	schema: {
		headers: {
			type: 'object',
			properties: {
				'hdb-token': { type: 'string' }
			},
			required: [ 'hdb-token' ]
		}
	}
}, async (req, res) => {
	const token = req.headers['hdb-token']

	const getPostsRes = await server.hdb.getPosts(token)

	const redactAnonymousResearchers = getPostsRes.map((post: Post) =>
		post.anonymous ? { ...post, researcher: undefined } : post
	)
	console.log(getPostsRes)

	return redactAnonymousResearchers
})

server.post<{
	Headers: {
		'hdb-token': string
	},
	Body: {
		username: string,
		post: {
			content: string,
			anonymous: boolean
		}
	}
}>('/create-post', {
	schema: {
		headers: {
			type: 'object',
			properties: {
				'hdb-token': { type: 'string' }
			},
			required: [ 'hdb-token' ]
		},
		body: {
			type: 'object',
			properties: {
				username: { type: 'string' },
				post: {
					type: 'object',
					properties: {
						content: { type: 'string' },
						anonymous: { type: 'boolean' }
					},
					required: [ 'content', 'anonymous' ]
				}
			},
			required: [ 'username', 'post' ]
		}
	}
}, async (req, res) => {
	const token = req.headers['hdb-token']
	const username = req.body['username']
	const post = req.body['post']
	const createPostRes = await server.hdb.createPost(token, username, post)
	if (createPostRes.message.match('inserted 1 of 1 records')) {
		return { message: 'Successfully created post'}
	} else {
		res.code(400)
		return createPostRes
	}
})

server.listen(8080, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}

	console.log(`Server listening at ${address}`)
})