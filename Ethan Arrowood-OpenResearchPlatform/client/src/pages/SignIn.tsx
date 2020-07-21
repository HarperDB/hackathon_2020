import React, { FormEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'

// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

// Local imports
import { useAuth } from '../utils/auth'

const SignIn = () => {
	const [error, setError] = React.useState<string>()
	const [username, setUsername] = React.useState<string>('')
	const [password, setPassword] = React.useState<string>('')
	const { signIn } = useAuth()
	const navigate = useNavigate()

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault()
		setError(undefined)

		try {
			await signIn(username, password)
			setUsername('')
			setPassword('')
			navigate('/')
		} catch (error) {
			setError(error.message)
		}
	}

	return (
		<Row>
			<Col xs={12}>
				<h1>Sign In</h1>
			
			</Col>
			<Col xs={12} sm={8} md={6} lg={4}>
				<Form onSubmit={handleSubmit}>
					{
						error && (
							<Form.Text className="text-danger">
								{error}
							</Form.Text>
						)
					}
					<Form.Group controlId='username'>
						<Form.Label>Username</Form.Label>
						<Form.Control 
							type='text'
							placeholder='Username'
							value={username}
							onChange={(event) => {
								setUsername(event.target.value)
							}}
							required
						/>
					</Form.Group>
					<Form.Group controlId='password'>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Password'
							value={password}
							onChange={(event) => {
								setPassword(event.target.value)
							}}
							required
						/>
					</Form.Group>
					<Button variant='primary' type='submit'>Sign In</Button>
				</Form>
			</Col>
		</Row>
	)
}

export default SignIn