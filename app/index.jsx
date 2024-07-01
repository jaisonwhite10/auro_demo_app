import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';

import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';



export default function App() {
  const {isLoading, isLoggedIn} = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/home" />; // Conditional redirect
  
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full justify-center items-center min-h-[60vh] px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[44px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />
          <View className="relative mt-4">
            <Text className="text-3xl text-white font-bold text-center">
              Discover endless possibilities with{' '}
              <Text className="text-secondary-200">Aora</Text>
            </Text>
          </View>
          <Image
            source={images.path}
            className="w-[136px] h-[15px] absolute -bottom-2 -right-32"
            resizeMode="contain"
          />
        </View>
        <Text className="text-sm font-regular text-gray-100 mt-7 mb-7 text-center">
          Where creativity meets innovation: embark on a journey of limitless exploration with Aora
        </Text>
        <CustomButton
          title="Continue with Email"
          handlePress={() => router.push('/sign-in')}
        />
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}



