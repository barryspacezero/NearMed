import { useState, useCallback, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import {supabase} from '/supabaseClient'

const libraries = ['places']

function Map() {
  const [userLocation, setUserLocation] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [map, setMap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedHospital, setSelectedHospital] = useState(null)

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
    libraries
  })

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setLoading(false)
        },
        (error) => {
          setError('Unable to retrieve your location')
          setLoading(false)
        }
      )
    } else {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
    }
  }, [])

  const searchNearbyHospitals = useCallback((map, location) => {
    const service = new window.google.maps.places.PlacesService(map)
    const request = {
      location,
      radius: 5000,
      type: 'hospital'
    }

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((hospital) => {
          service.getDetails(
            {
              placeId: hospital.place_id,
              fields: ['name', 'formatted_address', 'geometry', 'place_id']
            },
            (place, detailStatus) => {
              if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK) {
                setHospitals(prev => {
                  // Avoid duplicates
                  const exists = prev.some(h => h.place_id === place.place_id)
                  if (!exists) {
                    return [...prev, place]
                  }
                  return prev
                })
              }
            }
          )
        })
      }
    })
  }, [])

  const onLoad = useCallback((map) => {
    setMap(map)
    if (userLocation) {
      searchNearbyHospitals(map, userLocation)
    }
  }, [userLocation, searchNearbyHospitals])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const getDirectionsUrl = (hospital) => {
    if (!userLocation || !hospital.geometry) return ''
    const origin = `${userLocation.lat},${userLocation.lng}`
    const destination = `${hospital.geometry.location.lat()},${hospital.geometry.location.lng()}`
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading Maps...</div>
      </div>
    )
  }


  return (
    <div className="min-h-screen">
      <div className="p-4 bg-white shadow-md flex justify-evenly  backdrop-blur-2xl">
          <h1 className="text-2xl font-bold text-gray-800">Nearby Hospitals - Displaying hospitals in a 5km radius</h1>
        <button className='rounded-md text-white bg-blue-500 p-3' onClick={() => supabase.auth.signOut()}>Log out</button>
        
      </div>
      
      <div className="h-[calc(100vh-100px)]">
        {userLocation && (
          <GoogleMap
            mapContainerClassName="w-full h-full"
            center={userLocation}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <Marker
              position={userLocation}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
              }}
              label={'YOU'}
            />
            
            {hospitals.map((hospital) => (
              <Marker
                key={hospital.place_id}
                position={hospital.geometry.location}
                title={hospital.name}
                onClick={() => setSelectedHospital(hospital)}
                label={'H'}
              />
            ))}
            {selectedHospital && (
              <InfoWindow
                position={selectedHospital.geometry.location}
                onCloseClick={() => setSelectedHospital(null)}
              >
                <div className="max-w-xs">
                  <h2 className="text-lg font-semibold mb-2">{selectedHospital.name}</h2>
                  <p className="text-sm text-gray-600 mb-3">{selectedHospital.formatted_address}</p>
                  <a
                    href={getDirectionsUrl(selectedHospital)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  )
}

export default Map
