import { useEffect, useState } from "react"
import Footer from "./components/Footer"
import Main from "./components/Main"
import Sidebar from "./components/Sidebar"

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function handleToggleModal() {
    setShowModal(!showModal)
  }

  useEffect(() => {
    async function fetchAPIData() {
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;
      const url = "https://api.nasa.gov/planetary/apod" + `?api_key=${NASA_KEY}`

      const today = (new Date()).toDateString()
      const localKey = `NASA-${today}`

      if (localStorage.getItem(localKey)) {
        const apiData = JSON.parse(localStorage.getItem(localKey));
        setData(apiData);
        setLoading(false);
        console.log("Fetched from cache today");
        return
      }

      try {
        setLoading(true);
        const response = await fetch(url);
        const apiData = await response.json();
        localStorage.setItem(localKey, JSON.stringify(apiData))
        setData(apiData);

        console.log("fetched from api today - data\n" + apiData);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAPIData();
  }, [])

  if (loading) return (
    <div className="loadingState">
      <i className="fa-solid fa-gear"></i>
    </div>
  )

  return (
    <>
      {data ? <Main data={data} /> :
        <div className="loadingState">
          <i className="fa-solid fa-gear"></i>
        </div>
      }
      <Sidebar data={data} handleToggleModal={handleToggleModal} isOpen={showModal} />
      {data && <Footer data={data} handleToggleModal={handleToggleModal} />}
    </>
  )
}

export default App
