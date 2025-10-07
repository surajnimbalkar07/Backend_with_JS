import { useEffect, useState } from 'react'
import Axios from 'axios'
import './App.css'

function App() {
  const [jokes, setJokes] = useState([])

  useEffect(() => {
    Axios.get('/api/jokes').then((response)=>{
      setJokes(response.data)//we didnt convert response data in json as we are using axios here it will handle it by default
    }).catch((error)=>{
      console.log(error)
    })
      
    }
, [])

  return (
    <>
      <div>
        <h2>Latest Jokes</h2>
        <p>Total Jokes are {jokes.length}</p>
        {jokes.map((joke, id) => (
          <div  key={id}>
            <h2>{joke.name}</h2>
            <h3>{joke.rate}</h3>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
