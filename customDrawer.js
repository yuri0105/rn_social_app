import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Button, Container, Content, Header, Right } from 'native-base';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';

const Sidebar = ({ isDarkTheme, setIsDarkTheme, ...props }) => {
  const handlePress = () => {
    props.navigation.dispatch(DrawerActions.closeDrawer());
    props.navigation.navigate('Settings');
  };
  const { colors } = useTheme()
  const toggleTheme = () => {
    setIsDarkTheme();
  }
  // console.log('navi--?',props.navigation);
  return (
    <Container style={{ backgroundColor: colors.background }}>
      <Header
        style={{
          backgroundColor: colors.background,
          borderBottomWidth: 0,
          marginTop: 70,
          borderWidth: 0,
        }}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <Right>
          <Button transparent>
            <TouchableOpacity onPress={() => handlePress()}>
              <Ionicons name="ios-options" size={28} color={colors.icon} />
            </TouchableOpacity>
          </Button>
        </Right>
      </Header>
      <Content>
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>

        <TouchableOpacity>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingRight: 20, paddingLeft: 20, paddingTop: 10 }}>
            <Text style={{ flex: 1, color: colors.text }}>Dark Theme</Text>
            <View>
              <Switch onValueChange={toggleTheme} value={isDarkTheme} />
            </View>
          </View>
        </TouchableOpacity>
      </Content>
    </Container>
  );
};

export default Sidebar;

const styles = StyleSheet.create({});
