import { View, Text, FlatList} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import { searchPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useLocalSearchParams } from 'expo-router';
import { _DEFAULT_PROGRESS_UPDATE_INTERVAL_MILLIS } from 'expo-av/build/AV';

const Search = () => {
  const {query} = useLocalSearchParams()
  const {data: posts, refetch} = useAppwrite(() => searchPosts(query));

  console.log(query)
  console.log('All posts:', posts); // Debug log for getAllPosts
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refetch();
  }, [query])

  
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={() => (
          <View className=" flex my-6 px-4">
            
              
                <Text className="font-pmedium text-sm text-gray-100">
                  Search Results
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
        
      />
    </SafeAreaView>
  );
};

export default Search;
