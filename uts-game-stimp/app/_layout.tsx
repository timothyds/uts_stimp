import { Stack, useRouter } from "expo-router";
import { AuthProvider,useAuth } from "./authContext";
import { useEffect } from "react";

function RootLayout() {
  const { isLoggedIn } = useAuth(); 
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login" as any);
    } else {
      router.replace("/");
    }
  }, [isLoggedIn]);


  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="game/drawer" options={{ headerShown: false }} />
      <Stack.Screen name="game/grid" options={{ headerShown: false }} /> 
      <Stack.Screen name="game/highscore" options={{ title: 'High Score' }} /> 
      <Stack.Screen name="main" options={{ headerShown:false }} />

    </Stack >
  );
}
export default function Layout() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}


