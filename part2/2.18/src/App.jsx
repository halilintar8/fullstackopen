import React, { useState, useEffect } from 'react';

function App() {
    const [countries, setCountries] = useState([]);
    const [query, setQuery] = useState("");
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);

    useEffect(() => {
        // Fetch countries data only once when component mounts
        fetch("https://studies.cs.helsinki.fi/restcountries/api/all")
            .then(response => response.json())
            .then(data => setCountries(data))
            .catch(error => console.error("Error fetching countries:", error));
    }, []);

    useEffect(() => {
        // Filter countries based on the query
        if (query) {
            const matchedCountries = countries.filter(country =>
                country.name.common.toLowerCase().includes(query.toLowerCase())
            );

            if (matchedCountries.length > 10) {
                setFilteredCountries("Too many matches, specify another filter");
                setSelectedCountry(null);
            } else if (matchedCountries.length > 1) {
                setFilteredCountries(matchedCountries);
                setSelectedCountry(null);
            } else if (matchedCountries.length === 1) {
                setSelectedCountry(matchedCountries[0]);
                setFilteredCountries([]);
            } else {
                setFilteredCountries("No matches found");
                setSelectedCountry(null);
            }
        } else {
            setFilteredCountries([]);
            setSelectedCountry(null);
        }
    }, [query, countries]);

    const handleQueryChange = (event) => {
        setQuery(event.target.value);
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h1>find countries</h1>
            <input type="text" value={query} onChange={handleQueryChange} />
            
            {Array.isArray(filteredCountries) ? (
                <ul>
                    {filteredCountries.map(country => (
                        <li key={country.cca3}>{country.name.common}</li>
                    ))}
                </ul>
            ) : (
                <p>{filteredCountries}</p>
            )}

            {selectedCountry && (
                <div>
                    <h2>{selectedCountry.name.common}</h2>
                    <p>capital: {selectedCountry.capital}</p>
                    <p>area: {selectedCountry.area}</p>
                    <h3>languages:</h3>
                    <ul>
                        {Object.values(selectedCountry.languages).map(lang => (
                            <li key={lang}>{lang}</li>
                        ))}
                    </ul>
                    <img
                        src={selectedCountry.flags.png}
                        alt={`Flag of ${selectedCountry.name.common}`}
                        style={{ width: "150px", marginTop: "1rem" }}
                    />
                </div>
            )}
        </div>
    );
}

export default App;
