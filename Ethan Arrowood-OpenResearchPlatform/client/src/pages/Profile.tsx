import React, { FormEventHandler } from 'react'
import { useAuth, AuthenticatedAuthContext } from '../utils/auth'

// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { API_URL } from '../utils/constants'

const Profile = () => {
	const { user, setUser } = useAuth() as AuthenticatedAuthContext
	const [error, setError] = React.useState<string>()
	const [success, setSuccess] = React.useState<string>()
	const [email, setEmail] = React.useState<string>(user.profile.email)

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault()
		setError(undefined)

		try {
			const res = await fetch(`${API_URL}/update-researcher`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					'hdb-token': user.token
				},
				body: JSON.stringify({
					username: user.username,
					profile: {
						email
					}
				})
			})
			if (res.ok) {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const {__createdTime__, __updatedTime__, username, ...profile }= await res.json()
				setUser({ ...user, profile })
				setSuccess('Profile Updated!')
			} else {
				const { message } = await res.json()
				setError(message)
			}
		} catch (error) {
			setError(error.message)
		}
	}

	return (
		<Row>
			<Col xs={12} sm={6} md={4}>
				<h2>Profile</h2>
				<Form onSubmit={handleSubmit}>
					{
						error && (
							<Form.Text className="text-danger">
								{error}
							</Form.Text>
						)
					}
					<Form.Group controlId='email'>
						<Form.Label>Email</Form.Label>
						<Form.Control 
							type='text'
							placeholder='example@email.com'
							value={email}
							onChange={(event) => {
								setEmail(event.target.value)
							}}
							required
						/>
					</Form.Group>
					<Button variant='primary' type='submit'>Update Profile</Button>
					{
						success && (
							<Form.Text className="text-success">
								{success}
							</Form.Text>
						)
					}
				</Form>
			</Col>
		</Row>
	)
}

export default Profile