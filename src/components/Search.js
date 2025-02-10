import "./Search.css";

const Search = () => {
  return (
    <header>
      <input
        type="text"
        className="header__search"
        placeholder="Enter an address, neighborhood, city, or ZIP code"
      />
    </header>
  );
};

export default Search;
