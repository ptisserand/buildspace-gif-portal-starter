import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'ptisserand';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
  "https://media3.giphy.com/media/3o6UBiAQ9Ws8UWdmqA/giphy.gif",
  "https://media0.giphy.com/media/26tPplGWjN0xLybiU/giphy.gif",
  "https://media1.giphy.com/media/4oMoIbIQrvCjm/giphy.gif",
  "https://media0.giphy.com/media/citBl9yPwnUOs/giphy.gif"
];

const App = () => {

  const [walletAddress, setWalletAddress] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected wth public key:', response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}>
      Connect to wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <div className='connected-container'>
    <form onSubmit={(event) => {
      event.preventDefault();
    }}>
      <input type='text' placeholder='Enter gif link!'></input>
      <button type='submit' className='cta-button submit-gif-button'>Submit</button>
    </form>
      <div className='gif-grid'>
        {TEST_GIFS.map(gif => (
          <div className='gif-item' key={gif}>
          <img src={gif} alt={gif}/>
          </div>
        ))}
      </div>
    </div>
  );
  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    }
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 Simpsons GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
