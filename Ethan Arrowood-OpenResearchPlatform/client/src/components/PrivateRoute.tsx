import React from 'react'
import { RouteProps } from 'react-router'
import { Route } from 'react-router-dom'

// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { useAuth } from '../utils/auth'

const PrivateRoute: React.FC<RouteProps> = ({ element, path, ...rest }) => {
	const { user } = useAuth()

	return <Route path={path} element={
		user ? element : (
			<Row>
				<Col style={{
					textAlign: 'center'
				}}>
					<h4>You must be authenticated to view this page</h4>
				</Col>
			</Row>
		)
	} {...rest} />
}

export default PrivateRoute