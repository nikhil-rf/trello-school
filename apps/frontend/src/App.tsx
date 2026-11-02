import { useEffect, useState } from 'react'
import './App.css'
import { Route, Routes, BrowserRouter, useParams } from 'react-router'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/board/:boardId" element={<Board />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

function Board() {
  const {boardId} = useParams()
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:3002")
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", boardId }))
    }
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data)
      if(data.type === "initial_state"){
        setUsers(data.users);
      }
      if(data.type === "join"){
        setUsers(u => [...u, {id: data.userId}]);
      }
      if(data.type === "Leave"){
        setUsers(u => u.filter(x => x.id != data.userId));
      }
    }
  }, [])
  return <div>
    you are on {boardId}
    <br />
    current active users -- {JSON.stringify(users)}
  </div>
}
export default App
