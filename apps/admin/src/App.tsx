import { createSignal } from 'solid-js'

function App() {
  const [count, setCount] = createSignal('0')
  const getHello = async () => {
    const res = await fetch('/api/hello').then(res => res.json())
    setCount(() => res.msg)
  }
  getHello()
  return (
    <>
      <div>{count()}</div>
    </>
  )
}

export default App
