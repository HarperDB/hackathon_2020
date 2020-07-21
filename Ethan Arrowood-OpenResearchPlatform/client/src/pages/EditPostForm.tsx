import React, { FormEventHandler } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useAuth, AuthenticatedAuthContext } from '../utils/auth'
import abortFetch from '../utils/abortFetch'
import { Post } from '../App'
import { HDB_URL } from '../utils/constants'

const EditPostForm: React.FC<{ post: Post }> = ({ post }) => {
	const { user } = useAuth() as AuthenticatedAuthContext
	const [error, setError] = React.useState<string>()
	const [success, setSuccess] = React.useState<string>()

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault()
		setError(undefined)

		const { abort, ready } = abortFetch(HDB_URL, {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				'authorization': `Basic ${user.token}`
			},
			body: JSON.stringify({
				operation: 'update',
				schema: 'dev',
				table: 'posts',
				records: [
					post
				]
			})
		})

		ready
			.then(res => {
				if ( res.ok ) {
					setSuccess('Post Updated!')
				} else {
					res.json().then(
						({ message }) => setError(message)
					)
				}
			})
			.catch(error => {
				setError(error.message)
			})
	}
	
	return (
		<Form onSubmit={handleSubmit}>
			{
				error && (
					<Form.Text className="text-danger">
						{error}
					</Form.Text>
				)
			}
			<Form.Group controlId='content'>
				<Form.Label>Post</Form.Label>
				<Form.Control 
					as='textarea'
					placeholder='Post content'
					value={post.content}
					onChange={(event) => {
						post.content = event.target.value
					}}
					required
				/>
			</Form.Group>
			<Form.Group controlId='isAnonymous'>
				<Form.Check 
					type='checkbox'
					placeholder='Post content'
					label='Publish Anonymously'
					checked={post.anonymous}
					onChange={() => {
						post.anonymous = !post.anonymous
					}}
				/>
			</Form.Group>
			<Button variant='primary' type='submit'>Edit Post</Button>
			{
				success && (
					<Form.Text className="text-success">
						{success}
					</Form.Text>
				)
			}
		</Form>
	)
}

export default EditPostForm