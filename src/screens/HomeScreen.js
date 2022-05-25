import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import axiosInstance, {API_KEY} from '../utils/axios';
import PostItem from '../components/PostItem';
import {AntDesign, Feather} from '@expo/vector-icons';
const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const handleRefresh = () => {
    setLoading(true);
    fetchData().then(setLoading(false));
  };
  const handleMoveToTop = () => {
    listRef.current.scrollToOffset({offset: 0, animated: true});
  };

  const fetchData = async () => {
    axiosInstance
      .get(`/posts/?api_key=${API_KEY}&page_number=${nextPage}`)
      .then(res => {
        setNextPage(res._links.next.query_params.page_number);
        const newData = res.posts.map(item => {
          return {
            id: item.id,
            imageUri: item.photos[0].original_size.url,
            imageSize: {
              width: item.photos[0].original_size.width,
              height: item.photos[0].original_size.height,
            },
            date: item.date,
            timestamp: item.timestamp,
            caption: item.caption,
            tags: item.tags,
          };
        });
        setData([...newData, ...data]);
      });
  };
  useEffect(() => {
    fetchData().then();
  }, []);
  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <>
          <FlatList
            onScroll={e => {
              animatedValue.setValue(e.nativeEvent.contentOffset.y);
            }}
            scrollEventThrottle={16}
            ref={listRef}
            keyExtractor={item => item.id}
            removeClippedSubviews
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
            }
            data={data}
            renderItem={({item}) => {
              return <PostItem item={item} />;
            }}
          />
          <Animated.View
            style={[
              styles.btnAbs,
              {
                opacity: animatedValue.interpolate({
                  inputRange: [0, 1000],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
                }),
              },
            ]}>
            <TouchableOpacity style={styles.btnToTop} onPress={handleRefresh}>
              <Feather name="refresh-ccw" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnToTop} onPress={handleMoveToTop}>
              <AntDesign name="arrowup" size={24} color={'#fff'} />
            </TouchableOpacity>
          </Animated.View>
        </>
      ) : (
        <ActivityIndicator size="large" color="white" />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffb5b5',
  },
  btnToTop: {
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ff8282',
    borderRadius: 50,
  },
  btnAbs: {
    position: 'absolute',
    bottom: 50,
    right: 20,
  },
});
export default HomeScreen;
