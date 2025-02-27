import {useEffect, useState} from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeMinimal, ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../supabaseClient'
import "./App.css"
import Map from './pages/Map'

function App() {
  const [session, setSession] = useState(0)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (<>
    <div className='flex justify-center bg-blue-300 mt-18'>
    <div className="flex justify-center border-4 bg-white shadow-blue-950 shadow-2xl border-blue-800 w-auto px-15 rounded-md">
    <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={["google"]} />
    </div>
    </div>
    </>)
  }
  else {
    return (<>
    <Map />
    </>)
    
  }
}

export default App
