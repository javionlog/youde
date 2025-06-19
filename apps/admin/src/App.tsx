import { useState } from 'react'

function App() {
  const [count, setCount] = useState('0')
  const getHello = async () => {
    const res = (await fetch('/api/hello').then(res => res.json())) as { msg: string }
    setCount(() => res.msg)
  }
  getHello()
  return (
    <>
      <div>{count}</div>
    </>
  )
}

export default App
