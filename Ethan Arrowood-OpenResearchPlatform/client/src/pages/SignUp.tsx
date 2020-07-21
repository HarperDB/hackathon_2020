import React, { FormEventHandler } from 'react'

// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

// Local imports
import { useAuth } from '../utils/auth'

const SignUp = () => {
	const [error, setError] = React.useState<string>()
	const [success, setSuccess] = React.useState<string>()
	const [email, setEmail] = React.useState<string>('')
	const [username, setUsername] = React.useState<string>('')
	const [password, setPassword] = React.useState<string>('')
	const { signUp, user } = useAuth()

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault()
		setError(undefined)

		try {
			await signUp(email, username, password)
			setEmail('')
			setUsername('')
			setPassword('')
			setSuccess(`User ${username} successfully created`)
		} catch (error) {
			setError(error.message)
		}
	}

	return (
		<Row>
			<Col xs={12}>
				<h1>Sign Up</h1>
			</Col>
			<Col xs={12} sm={8} md={6} lg={4}>
				<Form onSubmit={handleSubmit}>
					{ user && <Form.Text className='text-muted'>Sign out to use this form.</Form.Text> }
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
							placeholder='Email'
							value={email}
							onChange={(event) => {
								setEmail(event.target.value)
							}}
							required
							disabled={!!user}
						/>
					</Form.Group>
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
							disabled={!!user}
						/>
						<Form.Text className="text-muted">*Cannot be changed</Form.Text>
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
							disabled={!!user}
						/>
					</Form.Group>
					<Button variant='primary' type='submit' disabled={!!user}>Sign Up</Button>
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

export default SignUp