import React from 'react'
import { Router, Route, Routes } from 'react-router-dom'

// Bootstrap 
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'

// Local imports
import NavBar from './components/NavBar'
import history from './utils/history'
import abortFetch from './utils/abortFetch'
import { API_URL } from './utils/constants'
import { useAuth } from './utils/auth'

// Pages
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import PrivateRoute from './components/PrivateRoute'
import ManagePosts from './pages/ManagePosts'

export interface Post {
	anonymous: boolean;
	content: string;
	id: string;
	researcher: string;
}
const Home = () => {
	const { user } = useAuth()
	const [posts, setPosts] = React.useState<Post[]>([])

	React.useEffect(() => {
		if (user) {
			const { abort, ready } = abortFetch(`${API_URL}/posts`, {
				headers: {
					'hdb-token': user.token
				}
			})
			ready
				.then(res => res.json())
				.then(res => setPosts(res))

			return () => abort()
		}
	}, [])
	return (
		<Row>
			<Col>
				<h1>Home</h1>
				<CardDeck>
					{ posts.map(post => {
						return (
							<Card key={post.id}>
								<Card.Body>
									<Card.Title>Post Title</Card.Title>
									<Card.Text>{post.content}</Card.Text>
								</Card.Body>
								<Card.Footer>
									<small className='text-muted'>Posted by: { post.anonymous ? 'Anonymous' : post.researcher }</small>
								</Card.Footer>
							</Card>
						)
					})}
				</CardDeck>
			</Col>
		</Row>
	)
}

function App () {
	return (
		<Router history={history}>
			<header>
				<NavBar />
			</header>
			<Container style={{ paddingTop: '60px' }}>
				<Routes>
					<Route path="/" element={<Home/>}/>
					<Route path='/sign-up' element={<SignUp/>}/>
					<Route path='/sign-in' element={<SignIn/>}/>
					<PrivateRoute path="/create-post" element={<CreatePost />} />
					<PrivateRoute path="/manage-posts" element={<ManagePosts />} />
					<PrivateRoute path="/profile" element={<Profile />} />
				</Routes>
			</Container>
		</Router>
	)

}

export default App