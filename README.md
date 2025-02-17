# NearMed

## Description

NearMed is a simple web app written in **React.js** that helps users find hospitals within a **5-kilometer radius** after fetching their location. It utilizes **Google Maps API** for location services and **Supabase Auth** for authentication.

## Tech Stack

- **Vite** – Fast build tool for React
- **React.js** – Frontend framework
- **Tailwind CSS** – Styling
- **Google Maps API** – For location and places data
- **Supabase Auth** – User authentication
- **React-Google-Maps/API** – Google Maps integration

## Features

- Fetches the user's current location.
- Displays hospitals within a **5km radius** on Google Maps.
- Allows authentication via **Supabase Auth** (Google login enabled).
- Provides details about each hospital (name, address, etc.).
- Interactive map with markers.

## Setup Instructions

### Prerequisites

- **Node.js** installed
- **Google Cloud Platform (GCP) account**
- **Supabase account**

### Steps

1. **Google Cloud Setup:**

   - Create a project on **Google Cloud Console**.
   - Enable **Places API** and **Maps JavaScript API**.
   - Generate an API key and restrict it to your domain.

2. **Clone the Repository:**

   ```sh
   git clone https://github.com/barryspacezero/NearMed.git
   cd NearMed
   ```

3. **Install Dependencies:**

   ```sh
   npm install
   ```

4. **Set Up Environment Variables:**
   Create a `.env` file in the root directory and add:

   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the Project:**

   ```sh
   npm run dev
   ```

6. **Deploy on Vercel:**

   - Push your project to **GitHub**.
   - Connect your repository to **Vercel**.
   - Add the required environment variables in Vercel’s dashboard.
   - Deploy and access the live version!

## Deployment

The project is deployed on **Vercel** for easy access.

---

Feel free to contribute, report issues, or suggest improvements!

