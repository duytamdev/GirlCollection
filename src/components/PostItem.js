import React, {useCallback, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';
import {Feather} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
const TagItem = ({title}) => {
  return (
    <View style={{marginRight: 4}}>
      <Text style={{color: '#7e7e7e', fontSize: 16}}>{`#${title}`}</Text>
    </View>
  );
};
const ItemLike = () => {
  const [liked, setLiked] = useState(false);
  return (
    <TouchableOpacity onPress={() => setLiked(!liked)}>
      <FontAwesome
        name={liked ? 'heart' : 'heart-o'}
        size={24}
        color={liked ? 'red' : 'black'}
      />
    </TouchableOpacity>
  );
};
const SectionFooter = ({onDownload}) => {
  return (
    <View style={{marginTop: 10}}>
      <View style={styles.diver} />
      <View style={styles.footerContent}>
        <TouchableOpacity
          onPress={() =>
            ToastAndroid.show('Features in development', ToastAndroid.SHORT)
          }>
          <MaterialCommunityIcons
            name="share-outline"
            size={28}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            ToastAndroid.show('Features in development', ToastAndroid.SHORT)
          }>
          <FontAwesome name="comment-o" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDownload}>
          <Feather name="download" size={24} color="black" />
        </TouchableOpacity>
        <ItemLike />
      </View>
      <View style={styles.diver} />
    </View>
  );
};
const PostItem = ({item}) => {
  const getPermissionAsync = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
    }
  };
  const handleDownloadImage = useCallback(async imageUrl => {
    await getPermissionAsync();
    const nameImage = imageUrl.split('/').pop();
    try {
      const localuri = await FileSystem.downloadAsync(
        imageUrl,
        `${FileSystem.documentDirectory}${nameImage}`,
      );

      const asset = await MediaLibrary.createAssetAsync(localuri.uri);
      const album = await MediaLibrary.getAlbumAsync('Download');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('Download', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
    } catch (e) {
      console.log('error', e);
      return;
    }
    Alert.alert('Hình ảnh đã được tải về thành công');
  }, []);
  return (
    <View style={styles.container}>
      <Image
        style={{
          width: '100%',
          aspectRatio: item.imageSize.width / item.imageSize.height,
        }}
        source={{uri: item.imageUri}}
      />
      <View style={styles.content}>
        <RenderHtml contentWidth={48} source={{html: item.caption}} />
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <TagItem key={index} title={tag} />
          ))}
        </View>
        <SectionFooter onDownload={() => handleDownloadImage(item.imageUri)} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  content: {paddingHorizontal: 16},
  container: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  diver: {
    height: 0.6,
    backgroundColor: '#e6e6e6',
  },
  footerContent: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
export default PostItem;
