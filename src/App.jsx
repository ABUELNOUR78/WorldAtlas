import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [countries , setcountries] = useState([]);
  const [searchInput , setSearchInput] = useState("");
  const [loading , setLoading] = useState(false);
  const [errorMassage , setErrorMassage] = useState("");
  const regions = ["Americas","Asia","Europe","Oceania","Africa" ,"Antarctic"];
  const [results , setresults] = useState(null);
  const [suggestions , setsuggestions] = useState([]);
  

  
  




  function genrateSegution(input) {
    setSearchInput(input);
    if(input === ""){
      setsuggestions([])
      return;
    }
    const search = input.toLowerCase().trim();
    const array = countries.filter(el => el.name.common.toLowerCase().includes(search));

    setsuggestions([...array]);


  }
  


  

  function genrateByRegion(region) {
    if(region ==="")return ;
    const array = countries.filter(el => el.region === region);

    setresults(array);

    console.log(array);

  }






  async function getCountries() {
    try {
    setLoading(true)
      const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,flags,population,region"
      );
      const data = await res.json();

      setcountries(data)
      console.log(data);
    } catch  {
      setErrorMassage("Failed to fetch countries");
    }finally {
    setLoading(false);
  }
  }

    useEffect(() => {
  getCountries();
}, []);

  
  function searchCountyName(input) {
    setErrorMassage("");
    const inputSearch = input.toLowerCase().trim();
    const search = countries.find(el => el.name.common.toLowerCase() === inputSearch);  
    
    if(!search){
      setErrorMassage("the name is not correct");
      setresults([]);
      return;
    }

    setresults([search]);


    setsuggestions([]);
    setSearchInput(input);
  }




  return (
    <>
    <h1
    className='text-center text-5xl mt-8 font-bold'
    >WorldAtlas</h1>
    <div className='flex justify-center items-center gap-5 flex-col h-screen'>
    {loading && (
    <div className='border-2 w-[30%] h-5 rounded-lg flex items-center'>
    <div className='w-full bg-green-500 h-3.5 rounded-lg loading'></div>
    </div>
      )}

      <div className='flex gap-5 flex-col w-[90%] container '>

      <div 
        className='relative'>
        <input
        value={searchInput}
        placeholder='enter the country name'
        // onChange={(e) => setSearchInput(e.target.value)}
        onChange={(e) => genrateSegution(e.target.value)}
        className='text-2xl p-1 rounded-lg border-2 w-full' 
        type="text"  />
        
        <div className='bg-[rgba(245,245,245,0.901)] max-h-36 overflow-y-auto absolute left-0 w-full'>
          {suggestions && suggestions.map((el) => {
            return(
          <div
          value={el.name.common}
          onClick={() => {searchCountyName(el.name.common)}}
          className='hover:bg-yellow-100 cursor-pointer w-full p-2'>{el.name.common }</div>
          )})}
        </div>

      </div>



        <button
        onClick={() => searchCountyName(searchInput)}
        className='bg-green-700 p-2 rounded-lg text-white h-fit'>search</button>

        <select
          onChange={(e) => {genrateByRegion(e.target.value)}} 
          className='bg-yellow-100 h-fit p-2 rounded-lg ring-2 ring-black'
          name="" id="">
          <option
            className='p-0.5'
            value="">select the region
          </option>
          {regions.map((el) => {
            return(
          <option
            key={el}
            className='p-0.5'
            value={el}>
              {el}
          </option>
            )
          })}
        </select>

      </div>
      <p
      className='text-red-700 text-2xl'
      >{errorMassage}</p>
      
      <div className='flex flex-col gap-3 w-[90%] max-h-100 overflow-y-auto country-container'>
      
      {results && results.map((el) =>{
        return(
          <div
            key={el.name.common} 
            className='flex flex-col text-center gap-3
            items-center bg-emerald-100  justify-between w-full  '>
            <p className='font-bold'>{el.name.common}</p>
            <img
              className='h-32 w-36' 
              src={el.flags.png}
              alt={el.flags.alt}  
              />
              <p>region :   {el.region}</p>
              <p>population : {el.population}</p>
          </div>
      )})
      }
      </div>
      
    </div>
    
    </>
  )
}

export default App
