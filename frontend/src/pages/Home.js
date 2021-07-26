import { useEffect } from 'react';
import './Padding.css'
import { useHistory } from 'react-router-dom';
import store from '../store'

const Home = () => {
  const history = useHistory()
  useEffect(() => {
    if (store.getState().id) {
      history.push('./taskboard')
    }
  })

  return (
    <>
    <div className='padding'><h1> Home Page </h1> </div>
    </>
  )
}

export default Home;