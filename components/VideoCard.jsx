import { View, Text, Image, TouchableOpacity,StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { icons } from '../constants'
import { Video, ResizeMode } from 'expo-av'
import { useGlobalContext } from '../context/GlobalProvider'
import { savePost,unSavePost } from '../lib/appwrite'


const VideoCard = ({video: {title, thumbnail, video, creator: {username, avatar}, bookmark, $id: videoId, $collectionId, $databaseId} }) => {
  const {user, setUser,setIsLoggedIn} = useGlobalContext();
  const [play, setPlay] = useState(false);
  const [saved, setSaved] = useState(false);


  useEffect(() => {
    const userBookmark = bookmark.find(item => item.$id === user.$id);
      if (userBookmark) {
        setSaved(true)
      } else {
        setSaved(false)

      }
      

  },[bookmark,user.$id])


  const handlePress = async (id,userId,bookmark) => {
    if (!saved) {
      setSaved(true);
      await savePost(id,userId,bookmark)
    } else {
      setSaved(false);
       await unSavePost(id,userId,bookmark)
    }
    
    
   
  }

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className=" justify-center items-center flex-row flex-1">
            <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
                <Image source = {{uri: avatar}} className="w-full h-full rounded-lg" resizeMode='cover'/>

            </View>

            <View className="justify-center flex-1 ml-3 gap-y-1">
                <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
                   {title} 
                </Text>
                <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
                    {username}
                </Text>

            </View>

            <View className="justify-center items-center">
              <TouchableOpacity onPress={() => {handlePress(videoId,user.$id,bookmark)}}>
                <Image 
                source={icons.filledHeart} 
                resizeMode='contain' 
                className='w-5 h-5' 
                style={{ tintColor: saved ? '#FFA001': '#CDCDE0' }}

                // style={
                //   if (user.$id) in bookmark {
                //     {tintColor: '#FFA001'}
                //   } else {
                //     {tintColor: '#CDCDE0'}
                //   }
                  
                  
                // }
                />
                
              </TouchableOpacity>
            </View>

        </View>
        <View className="pt-2">
            <Image source={icons.menu} className="w-5 h-5" resizeMode='contain'/>
        </View>
      </View>  
    
      {play ?(
        <Video 
        source={{ uri: video }} /*should be video instead of link for videos from database videos in demo for some reason not working*/
        className="w-full h-60 rounded-xl mt-3"
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
        shouldPlay
        onError={(e) => {
          console.error('Video error:', e);
          setPlay(false); // Reset play state if there's an error
        }}
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            setPlay(false);
          }
        }}
      />
      ): (
        <TouchableOpacity activeOpacity={0.7} onPress={() => setPlay(true)} className="w-full h-60 rounded-xl mt-3 relative justify-center items-center">
            <Image source={{uri: thumbnail}} className="w-full h-full rounded-xl mt-3" resizeMode='cover'/>
            <Image source={icons.play} className="w-12 h-12 absolute" resizeMode='contain'/>
        </TouchableOpacity>
      )}  

      
    </View>
  )
}

export default VideoCard