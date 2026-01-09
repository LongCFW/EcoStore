import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Import Bootstrap CSS ở đây để dùng cho toàn dự án
import 'bootstrap/dist/css/bootstrap.min.css'
// Import file css tùy chỉnh (dù đang rỗng cũng cứ để đó)
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)