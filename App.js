import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [accessToken, setaccessToken] = useState(null);
  const [User, SetUser] = useState(null)
  const [request, response, promtAsync] = Google.useIdTokenAuthRequest({
    clientId: "Your Oauth client WEB ID",
    iosClientId: "Your oAuth client IOS ID"
  })
  React.useEffect(() => {
    if (response?.type === "success") {
      setaccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo();
    }
  }, [response, accessToken])
  async function fetchUserInfo() {
    let respone = await fetch("https://www.googleapis.com/userinfo/v2/me")
    headers:
    { Authorization: `Bearer ${accessToken}` }
    const useInfo = await respone.json();
    SetUser(useInfo);
  }
  const ShowUserInfo = () => {
    if (User) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 35, fontWeight: 'bold', marginBottom: 20 }}>Welcome</Text>
          <Image source={{ uri: User.picture }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{User.name}</Text>
        </View>
      )
    }
  }
  return (
    <View style={styles.container}>
      {User && <ShowUserInfo />}
      {User === null &&
        <>
          <Text style={{ fontSize: 35, fontWeight: 'bold' }}>Welcome</Text>
          <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 20, color: 'gray' }}>Please login</Text>
          <TouchableOpacity
            disabled={!request}
            onPress={() => {
              promtAsync();
              accessToken();
              
            }}
          >
            <Image source={require("./btn.png")} style={{ width: 300, height: 40 }} />
          </TouchableOpacity>
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
