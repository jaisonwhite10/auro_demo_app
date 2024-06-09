import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'


const Home = () => {
  return (
    <SafeAreaView className="bg-primary">
      <FlatList
      data={[]}
      keyExtractor={(item) => item.$id}
      renderItem={({item}) => (
        <Text className="text-3xl text-white">{item.id}</Text>
      )}  
      ListHeaderComponent={() => (
        <View className="my-6 px-4 sapce-y-6">
          <View className="justify-between items-start flew-row mb-6">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                Welcome Back
              </Text>
              <Text className="text-2xl font-psemibold text-white">
                Js Mastery
              </Text>
              <View classname="mt-1.5">
                <Image
                  source={images.logoSmall}
                />

              </View>
            </View>
          </View>
        </View>
      )}
      />
    </SafeAreaView>
  )
}

export default Home