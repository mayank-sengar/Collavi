import React from "react";
import { getNames } from 'country-list';

const CountriesList = ({userDetails , setUserDetails})=>{
 const countries = getNames();


  const handleChange = (e) =>{
    const selectedCountry = e.target.value;
     setUserDetails((prev) => ({
      ...prev,
      location: selectedCountry,
    }));
  };

  return (
    <>
    <select id="country" value= {userDetails.location} onChange={handleChange} className="w-max p-2 border-green-500 bg-gray-700 rounded-l" > 
     <option value = "" >Select a country</option>
     {countries.map((country, index) => (
  <option key={index} value={country}>{country}</option>
))}
    </select>
    </>
  )
}

export default CountriesList;