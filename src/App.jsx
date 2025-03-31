import { useState, useEffect} from 'react'
import MainMenu from './Sections/MainMenu';
import MainPanel from './Sections/MainPanel';

function App() {
  const [appActive, setAppActive] = useState(false);
  const [user, setUser] = useState({});
  const userLogin = (user) => {
    setAppActive(true);
    setUser(user)
  }
   useEffect(() => {
          window.electron.ipcRenderer.on('logout', (message) => {
              setAppActive(false);
          });
          return () =>{ window.electron.ipcRenderer.removeAllListeners('logout')}
      }, []);
  return (
    appActive ? <MainPanel/>: <MainMenu login={userLogin}/>
  )
}

export default App
