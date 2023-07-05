import { useEffect, useState } from 'react'
import './App.css'
import detectEthereumProvider from '@metamask/detect-provider'

const App = () => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null)

  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      console.log(provider);
      setHasProvider(Boolean(provider))
    }

    getProvider();
  }, [])

  return (
    <div className="App">
      {
        hasProvider && <button>Connect MetaMask</button>
      }
    </div>
  )
}

export default App
