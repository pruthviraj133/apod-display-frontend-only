import { useEffect, useState } from "react"
import Footer from "./components/Footer"
import Main from "./components/Main"
import Sidebar from "./components/Sidebar"

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const offlineData = {
    title: "Comet Lemmon Brightens",
    explaination: "Comet Lemmon is brightening and moving into morning northern skies. Besides Comet SWAN25B and Comet ATLAS, Comet C/2025 A6 (Lemmon) is now the third comet currently visible with binoculars and on long camera exposures. Comet Lemmon was discovered early this year and is still headed into the inner Solar System. The comet will round the Sun on November 8, but first it will pass its nearest to the Earth -- at about half the Earth-Sun distance -- on October 21. Although the brightnesses of comets are notoriously hard to predict, optimistic estimates have Comet Lemmon then becoming visible to the unaided eye. The comet should be best seen in predawn skies until mid-October, when it also becomes visible in evening skies. The featured image showing the comet's split and rapidly changing ion tail was taken in Texas, USA late last week.",
    date: "2025 September 30",
    hdurl: "https://apod.nasa.gov/apod/image/2509/CometLemmon_DeWinter_960.jpg"
  }
  console.log(offlineData);

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
      // localStorage.clear()

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
