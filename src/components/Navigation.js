import { ethers } from "ethers";
import logo from "../assets/logo.svg";
import { useState, useEffect } from "react";
import "./Navigation.css";

const Navigation = ({ account, setAccount }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  };

  return (
    <nav className={`nav ${isScrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__brand">
        <img src={logo} alt="Logo" className="nav__logo" />
        <h1>Dwellex</h1>
      </div>

      <ul className="nav__links">
        <li>
          <a href="#" className="nav__link">
            Buy
          </a>
        </li>
        <li>
          <a href="#" className="nav__link">
            Rent
          </a>
        </li>
        <li>
          <a href="#" className="nav__link">
            Sell
          </a>
        </li>
      </ul>

      {account ? (
        <button type="button" className="nav__connect">
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button type="button" className="nav__connect" onClick={connectHandler}>
          Connect
        </button>
      )}
    </nav>
  );
};

export default Navigation;
