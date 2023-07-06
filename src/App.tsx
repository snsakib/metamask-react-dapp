import { useEffect, useState } from "react";
import "./App.css";
import detectEthereumProvider from "@metamask/detect-provider";

const App = () => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const [wallet, setWallet] = useState(null);
  const [chainId, setChainId] = useState(null);
  const targetChainId = "0x1"; // Ethereum Mainnet

  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      console.log(provider);
      setHasProvider(Boolean(provider));
    };

    getProvider();
  }, []);

  const connectWallet = async () => {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setWallet(accounts);
    console.log(wallet);
    switchNetwork(targetChainId);
  };

  const switchNetwork = async (targetChainId) => {
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (currentChainId !== targetChainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: targetChainId,
                  chainName: "Ethereum Mainnet",
                  rpcUrls: ["https://eth.llamarpc.com"],
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
    console.log("ChainId: " + targetChainId);
  };

  return (
    <div className="App">
      {hasProvider && <button onClick={connectWallet}>Connect Wallet</button>}
    </div>
  );
};

export default App;
