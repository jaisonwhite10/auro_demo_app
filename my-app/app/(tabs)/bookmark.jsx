import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import { searchPosts,getSavedPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useLocalSearchParams } from 'expo-router';
import { _DEFAULT_PROGRESS_UPDATE_INTERVAL_MILLIS } from 'expo-av/build/AV';
import { useGlobalContext } from '../../context/GlobalProvider.js';


const Bookmark = () => {



  const {user, setUser,setIsLoggedIn} = useGlobalContext();
  const {query} = useLocalSearchParams()
  const {data: filteredPosts, refetch} = useAppwrite(() => getSavedPosts(user.$id,query));

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Add your refresh logic here
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    refetch();
  }, [query])

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={() => (
          <View className=" flex my-6 px-4">
                
                <Text className="font-pmedium text-sm text-gray-100">
                  Saved Posts
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {query}
                </Text>
            
            <View className="w-full mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>
            
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No videos found" subtitle="No video found for this search query" />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}

      />

    </SafeAreaView>
  )
}

export default Bookmark