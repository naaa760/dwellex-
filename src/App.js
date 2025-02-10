import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

// Components
import Navigation from "./components/Navigation";
import Search from "./components/Search";
import Home from "./components/Home";
import ScrollEffect from "./components/ScrollEffect";

// ABIs
import RealEstate from "./abis/RealEstate.json";
import Escrow from "./abis/Escrow.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [escrow, setEscrow] = useState(null);

  const [account, setAccount] = useState(null);

  const [homes, setHomes] = useState([]);
  const [home, setHome] = useState({});
  const [toggle, setToggle] = useState(false);

  const loadBlockchainData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // Add dummy data for testing
      const dummyHomes = [
        {
          id: 1,
          name: "Luxury Apartment",
          address: "1234 Elm St",
          description: "Beautiful apartment in downtown",
          image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
          attributes: [
            { trait_type: "Price", value: "1" },
            { trait_type: "Year", value: "2023" },
            { trait_type: "Bedrooms", value: "1" },
            { trait_type: "Bathrooms", value: "2" },
            { trait_type: "Square Feet", value: "3" },
          ],
        },
        {
          id: 2,
          name: "Beach House",
          address: "1234 Elm St",
          description: "Beautiful house with ocean view",
          image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
          attributes: [
            { trait_type: "Price", value: "1" },
            { trait_type: "Year", value: "2023" },
            { trait_type: "Bedrooms", value: "1" },
            { trait_type: "Bathrooms", value: "2" },
            { trait_type: "Square Feet", value: "3" },
          ],
        },
        {
          id: 3,
          name: "Modern Villa",
          address: "1234 Elm St",
          description: "Modern villa with pool",
          image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
          attributes: [
            { trait_type: "Price", value: "1" },
            { trait_type: "Year", value: "2023" },
            { trait_type: "Bedrooms", value: "1" },
            { trait_type: "Bathrooms", value: "2" },
            { trait_type: "Square Feet", value: "3" },
          ],
        },
      ];

      setHomes(dummyHomes);

      const network = await provider.getNetwork();

      const realEstate = new ethers.Contract(
        config[network.chainId].realEstate.address,
        RealEstate,
        provider
      );
      const totalSupply = await realEstate.totalSupply();
      const homes = [];

      for (var i = 1; i <= totalSupply; i++) {
        const uri = await realEstate.tokenURI(i);
        const response = await fetch(uri);
        const metadata = await response.json();
        homes.push(metadata);
      }

      setHomes(homes);

      const escrow = new ethers.Contract(
        config[network.chainId].escrow.address,
        Escrow,
        provider
      );
      setEscrow(escrow);

      window.ethereum.on("accountsChanged", async () => {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);
      });
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const togglePop = (home) => {
    setHome(home);
    toggle ? setToggle(false) : setToggle(true);
  };

  return (
    <div>
      <ScrollEffect />
      <Navigation account={account} setAccount={setAccount} />
      <Search />

      <div className="cards__section">
        <h3>Homes For You</h3>

        <hr />

        <div className="cards">
          {homes.map((home, index) => (
            <div className="card" key={index} onClick={() => togglePop(home)}>
              <div className="card__image">
                <img src={home.image} alt="Home" />
              </div>
              <div className="card__info">
                <h4>{home.attributes[0].value} ETH</h4>
                <p>
                  <strong>{home.attributes[2].value}</strong> bds |
                  <strong>{home.attributes[3].value}</strong> ba |
                  <strong>{home.attributes[4].value}</strong> sqft
                </p>
                <p>{home.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toggle && (
        <Home
          home={home}
          provider={provider}
          account={account}
          escrow={escrow}
          togglePop={togglePop}
        />
      )}
    </div>
  );
}

export default App;
