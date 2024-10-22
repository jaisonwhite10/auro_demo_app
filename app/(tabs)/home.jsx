import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import SearchInput from '../../components/SearchInput';
import  Trending  from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import { getAllPosts, getLatestPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider.js';

const Home = () => {

  const {user, setUser,setIsLoggedIn} = useGlobalContext();

  const {data: posts, refetch} = useAppwrite(getAllPosts);

  const {data: latestPosts} = useAppwrite(() => getLatestPosts());

  // console.log('All posts:', posts); // Debug log for getAllPosts
  // console.log('Latest posts:', latestPosts); // Debug log for getLatestPosts
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
   
    await refetch();
    setRefreshing(false);
  };

  
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
            <View className="flex flex-row justify-between items-start mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back,
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>
              <Image
                source={images.logoSmall}
                className="w-9 h-10"
                resizeMode="contain"
              />
            </View>
            <View className="w-full mb-6">
              <SearchInput />
            </View>
            <View className="w-full pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No videos found" subtitle="Be the first one to upload a video" />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default Home;
