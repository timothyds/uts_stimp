import React from 'react';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text } from 'react-native';
import Main from '../main';
import HighScore from './highscore';
import { useAuth } from '../authContext';
import App from './grid';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { logout, username } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 20, backgroundColor: '#f4f4f4' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Hello, {username}!</Text>
      </View>

      <DrawerItem
        label="High Score"
        onPress={() => props.navigation.navigate('HighScore')}
      />
      <DrawerItem
        label="Log Out"
        onPress={() => {
          logout(); 
          props.navigation.navigate('Login'); 
        }}
      />
    </DrawerContentScrollView>
  );
}

const DrawerLayout = () => {
  return (
    <Drawer.Navigator 
      initialRouteName="Game" 
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen 
        name="Game" 
        component={App}
        options={{ drawerLabel: 'Game' }} 
      />
      <Drawer.Screen 
        name="Main" 
        component={Main}
        options={{ drawerLabel: 'Main' }} 
      />
      <Drawer.Screen 
        name="HighScore" 
        component={HighScore}
        options={{ drawerLabel: 'High Score' }} 
      />
    </Drawer.Navigator>
  );
};

export default DrawerLayout;
