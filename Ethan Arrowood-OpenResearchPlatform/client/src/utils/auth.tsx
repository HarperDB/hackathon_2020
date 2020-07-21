import React from 'react'

import { API_URL } from './constants'

interface User {
	username: string;
	token: string;
	profile: {
		email: string;
	};
}

interface AuthContextProps {
	signUp: (email: string, username: string, password: string) => Promise<void>;
	signIn: (username: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
	setUser: (user: User) => void;
	user?: User;
}

export interface AuthenticatedAuthContext extends AuthContextProps {
	user: User;
}

const asyncNoop = async () => { /* do nothing. */ }

export const AuthContext = React.createContext<AuthContextProps>({
	signUp: asyncNoop,
	signIn: asyncNoop,
	signOut: asyncNoop,
	setUser: () => { /* do nothing. */ }
})

export const useAuth = () => React.useContext(AuthContext)

class AuthError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'AuthError'
	}
}

export const AuthProvider: React.FC = ({ children }) => {
	const cachedUser = localStorage.getItem('orp-user')
	const [user, _setUser] = React.useState<User | undefined>(cachedUser ? JSON.parse(cachedUser) : undefined)

	const setUser = (user: User) => {
		localStorage.setItem('orp-user', JSON.stringify(user))
		return _setUser(user)
	}

	const signUp = async (email: string, username: string, password: string) => {
		const res = await fetch(`${API_URL}/sign-up`, {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				username: username,
				password: password
			})
		})
		if (res.ok) {
			const user = await res.json()

			setUser(user)
		} else {
			const { message } = await res.json()
			throw new AuthError(message)
		}
	}

	const signIn = async (username: string, password: string) => {
		const res = await fetch(`${API_URL}/sign-in`, {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				username: username,
				password: password
			})
		})
		if (res.ok) {
			const user = await res.json()

			setUser(user)
		} else {
			const { message } = await res.json()
			throw new AuthError(message)
		}
	}

	const signOut = async () => {
		localStorage.removeItem('orp-user')
		_setUser(undefined)
	}

	const options = {
		user,
		setUser,
		signUp,
		signIn,
		signOut,
	}

	return <AuthContext.Provider value={options} >{children}</AuthContext.Provider>
}