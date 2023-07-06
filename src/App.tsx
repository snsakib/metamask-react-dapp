import { useEffect, useState } from "react";
import "./App.css";
import detectEthereumProvider from "@metamask/detect-provider";

const App = () => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const initialState = { accounts: [], balance: "" };
  const [wallet, setWallet] = useState(initialState);
  const targetChainId = "0x1"; // Ethereum Mainnet

  useEffect(() => {
    const refreshAccounts = (accounts: any, balance: any) => {
      if (accounts.length > 0) {
        console.log("wallet: " + JSON.stringify(wallet));
        setWallet((prevState) => ({
          ...prevState,
          accounts: accounts,
          balance: balance,
        }));
      } else {
        setWallet(initialState);
      }
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(Boolean(provider));

      if (provider) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        let balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        });

        refreshAccounts(accounts, balance);

        window.ethereum.on("accountsChanged", refreshAccounts);
      }
    };

    getProvider();

    return () => {
      window.ethereum.removeListener("accountsChanged", refreshAccounts);
    };
  }, []);

  const connectWallet = async () => {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    let balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [accounts[0], "latest"],
    });
    setWallet({ accounts, balance });
    switchNetwork(targetChainId);
    console.log("wallet " + JSON.stringify(wallet));
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
      {wallet.accounts.length > 0 && (
        <>
          <div>Account Address: {wallet.accounts[0]}</div>
          <div>Wallet Balance: {wallet.balance}</div>
        </>
      )}
    </div>
  );
};

export default App;
