import { Route, Routes } from 'react-router-dom'
import '../styles/app.css'
import AddVoit from './Add/AddVoit'
import { Header } from './Header'
import List from './List'
import Loader from './shared/Loader'
import Recette from './Recette'
import AddReservation from './Add/AddReservation'
import { useEffect, useState } from 'react'
import AddCli from './Add/AddCli'
import VoitureInfo from './Info/VoitureInfo'
import ReservInfo from './Info/ReservInfo'

export default function App() { 
    const [load, setLoad] = useState(false)
    useEffect(window.onload = ()=>{
        setTimeout(()=>{
            setLoad(true)
        } , 1500
        )
       
    },[])
    
    return(
        <>
            {/* { !load ?  */}
                {/* <Loader/> :  */}
                 <>
                 <div className='h-full'>
                    <Header/>
                    <div className='h-[100%]'>
                        <Routes>
                            <Route path="/" element ={<List/>} />
                            <Route path="/:type" element ={<List/>} />
                            <Route path="/info-voiture/:id" element ={<VoitureInfo/>} />
                            <Route path="/info-reservation/:id" element ={<ReservInfo/>} />
                            <Route path="/add-voiture" element ={<AddVoit/>} />
                            <Route path="/add-client" element ={<AddCli/>} />
                            <Route path="/add-reservation" element ={<AddReservation/>} />
                            <Route path="/recette" element ={<Recette/>} />
                        </Routes>
                    </div>
                 </div>
                </>
             {/* }   */}
        </>
    )
 }