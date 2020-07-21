import React from 'react'
import { NavLink } from 'react-router-dom'

// Bootstrap
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'

// Local imports
import { useAuth } from '../utils/auth'

const NavBar = () => {
	const { signOut, user } = useAuth()

	return (
		<Navbar bg='dark' variant='dark' fixed='top' expand='md' collapseOnSelect={true}>
			<Navbar.Brand className='text-primary font-weight-light'>Open Research Platform</Navbar.Brand>
			<Navbar.Toggle aria-controls='responsive-nav' />
			<Navbar.Collapse id='responsive-nav'>
				<Nav className='mr-auto'>
					<NavLink to='/' activeClassName='active' className='nav-link'>Home</NavLink>
					{
						!!user && (
							<>
								<NavLink to='/create-post' activeClassName='active' className='nav-link'>Create Post</NavLink>
								<NavLink to='/manage-posts' activeClassName='active' className='nav-link'>Manage Posts</NavLink>
							</>
						)
					}
				</Nav>
				<Nav className='ml-auto'>
					{
						user ? (
							<>
								<Button variant='primary' onClick={() => signOut()}>Log Out</Button>
								<NavLink to='/profile' className='text-primary nav-link' style={{ paddingLeft: '16px' }}>{user.username}</NavLink>
							</>
						) : (
							<>
								<NavLink to='/sign-in' activeClassName='active' className='nav-link'>Sign In</NavLink>
								<NavLink to='/sign-up' activeClassName='active' className='nav-link'>Sign Up</NavLink>
							</>
						)
					}
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	)
}

export default NavBar