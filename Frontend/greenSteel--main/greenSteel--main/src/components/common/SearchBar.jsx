import "./../../styles/common/SearchBar.css";

const SearchBar = ({
                       value,
                       onChange,
                       placeholder
                   }) => {

    return (

        <input
            className="search-bar"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />

    );

};

export default SearchBar;