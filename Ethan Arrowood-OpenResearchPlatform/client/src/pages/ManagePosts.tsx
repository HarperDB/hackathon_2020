/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/camelcase */
import React, { FormEventHandler } from 'react'
import { useAuth, AuthenticatedAuthContext } from '../utils/auth'

// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { API_URL, HDB_URL } from '../utils/constants'
import abortFetch from '../utils/abortFetch'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import { Post } from '../App'
import EditPostForm from './EditPostForm'

const ManagePosts = () => {
	const { user } = useAuth() as AuthenticatedAuthContext
	const [posts, setPosts] = React.useState<Post[]>([])
	const [editMode, setEditMode] = React.useState(false)
	const [editPost, setEditPost] = React.useState<Post>()
	const [content, setContent] = React.useState('')
	const [isAnonymous, setIsAnonymous] = React.useState(true)
	
	const handleModalClose = () => {
		setEditPost(undefined)
		setEditMode(false)
	}

	const toggleEdit = (post: Post) => {
		setEditMode(true)
		setEditPost(post)
	}

	const deletePost = (post: Post) => {
		const { abort, ready } = abortFetch(HDB_URL, {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				'authorization': `Basic ${user.token}`
			},
			body: JSON.stringify({
				operation: 'delete',
				schema: 'dev',
				table: 'posts',
				hash_values: [ post.id ]
			})
		})
	}

	React.useEffect(() => {
		const { abort, ready } = abortFetch(HDB_URL, {
			method: 'post',
			headers: {
				'content-type': 'application/json',
				'authorization': `Basic ${user.token}`
			},
			body: JSON.stringify({
				operation: 'search_by_value',
				schema: 'dev',
				table: 'posts',
				search_attribute: 'researcher',
				search_value: user.username,
				get_attributes: [ '*' ]
			})
		})

		ready
			.then(res => res.json())
			.then(res => setPosts(res))

		return () => abort()
	})

	return (
		<Row>
			<Col xs={12}>
				<h1>Manage Posts</h1>
				<CardDeck>
					{ posts.map(post => {
						return (
							<Card key={post.id}>
								<Card.Header>
									<Card.Title>Post Title</Card.Title>
								</Card.Header>
								<Card.Body>
									<Card.Text>{post.content}</Card.Text>
									<small className='text-muted'>Is Anonymous? - { post.anonymous ? 'True' : 'False' }</small>
								</Card.Body>
								<Card.Footer>
									<Button 
										variant='info'
										onClick={() => {
											toggleEdit(post)
										}}
									>
										<svg className="bi bi-pencil" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
											<path fill-rule="evenodd" d="M11.293 1.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-.39.242l-3 1a1 1 0 0 1-1.266-1.265l1-3a1 1 0 0 1 .242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z"/>
											<path fill-rule="evenodd" d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 0 0 .5.5H4v.5a.5.5 0 0 0 .5.5H5v.5a.5.5 0 0 0 .5.5H6v-1.5a.5.5 0 0 0-.5-.5H5v-.5a.5.5 0 0 0-.5-.5H3z"/>
										</svg>
									</Button>
									<Button
										variant='danger'
										className='float-right'
										onClick={() => {
											deletePost(post)
										}}
									>
										<svg className="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
											<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
											<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
										</svg>
									</Button>
								</Card.Footer>
							</Card>
						)
					})}
				</CardDeck>
				<Modal
					show={editMode}
					onHide={handleModalClose}
					backdrop='static'
					keyboard={false}
				>
					<Modal.Header closeButton>
						<Modal.Title>Edit Post</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{
							editPost ? (
								<EditPostForm post={editPost} />
							) : (
								<p>No post selected, please try again</p>
							)
						}
					</Modal.Body>
					<Modal.Footer>
						<Button variant='secondary' onClick={handleModalClose}>Close</Button>
					</Modal.Footer>
				</Modal>
			</Col>
		</Row>
	)
}

export default ManagePosts