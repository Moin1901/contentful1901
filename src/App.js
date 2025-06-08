import Users from "./components/User";
import { client } from "./client";
import { useState,useEffect } from "react";
import { useAuth } from "react-oidc-context";

function App() {
  
  const auth = useAuth();
  const [contacts, setContacts] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await client.getEntries({
          content_type:"contactlist"

        })
        // console.log(data.items[0].fields.title)
        setContacts(data.items[0].fields);
      } catch (error) {
        console.error('Error fetching contact list:', error);
      }
    }

    fetchData();
  }, []);
  console.log(contacts)

  const signOutRedirect = () => {
    auth.removeUser()
    const clientId = "6tg534f97ei0medpcc6qa3nmlk";
    const logoutUri = "http://localhost:3000/";
    const cognitoDomain = "https://eu-north-1ywwjvtvpb.auth.eu-north-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
     
        <Users/>

        {auth.isAuthenticated&&<button onClick={() => signOutRedirect()}>Sign out</button>}
        </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>signin</button>
    </div>
  );
}

export default App;
