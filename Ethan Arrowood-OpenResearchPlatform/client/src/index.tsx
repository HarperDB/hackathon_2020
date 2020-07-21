import React from 'react'
import ReactDOM from 'react-dom'

// Local imports
import App from './App'
import { AuthProvider } from './utils/auth'

// if (process.env.NODE_ENV === 'development') {
// 	require('dotenv').config()
// }

ReactDOM.render(
	<AuthProvider>
		<App />
	</AuthProvider>,
	document.getElementById('root')
)