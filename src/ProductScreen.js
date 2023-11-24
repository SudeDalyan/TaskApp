import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  NativeBaseProvider,
  ScrollView,
  Box,
  HStack,
  VStack,
  Text,
  Image,
  Card,
  Button,
} from 'native-base';
import StarRating from './StarRating';

const screenHeight = Dimensions.get('window').height;

const ImageSlider = ({images}) => {
  const renderItem = ({item}) => (
    <Image
      source={{uri: item}}
      style={{
        width: Dimensions.get('window').width,
        height: screenHeight * 0.65,
        resizeMode: 'cover',
      }}
    />
  );

  return (
    <View>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
      />
    </View>
  );
};

const Design = ({route}) => {
  const {productData} = route.params;
  const navigation = useNavigation();

  return (
    <NativeBaseProvider>
      <SafeAreaView></SafeAreaView>
      <ScrollView style={styles.container}>
        <Card
          rounded={5}
          backgroundColor="white"
          padding={0}
          shadow={2}
          height={screenHeight * 0.8}>
          {/* Ürün kartı içeriği */}
          <VStack space={2} position="relative">
            <ImageSlider images={productData.images} />
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                position: 'absolute',
                top: 5,
                left: 10,
                zIndex: 1,
              }}>
              <FontAwesomeIcon icon={faArrowLeft} size={18} color="#27272a" />
            </TouchableOpacity>
            <VStack space={2} p={3} alignItems="left">
              <Text fontSize="sm" color="gray.600" numberOfLines={2}>
                {productData.description}
              </Text>
              <HStack justifyContent="space-between" alignItems="center">
                <StarRating rating={productData.rating} />
                <Text fontSize="xs" color="gray.600" numberOfLines={2} ml={2}>
                  ({productData.stock})
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </Card>
        <Card
          rounded={5}
          backgroundColor="white"
          padding={0}
          shadow={2}
          marginY={5}
          height={screenHeight * 0.1}>
          <VStack space={2} position="relative" p={3}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color="gray.800"
              numberOfLines={2}>
              Renk
            </Text>
          </VStack>
        </Card>
      </ScrollView>
      <Box
        width="100%"
        bg="white"
        p="4"
        shadow={2}
        _text={{
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'gray.800',
        }}>
        <HStack space={2} padding={2}>
          <VStack flex={1}>
            <Text fontWeight="bold" fontSize="sm" color="gray.800">
              Ürün Fiyatı
            </Text>
            <Text fontSize="sm" color="gray.600">
              {productData.price} TL
            </Text>
          </VStack>
          <VStack>
            <Button
              size="sm"
              variant="outline"
              rounded={18}
              bg="gray.800"
              width="100%"
              _text={{color: 'white'}}
              onPress={() => navigation.goBack()}>
              Sepete Ekle
            </Button>
          </VStack>
        </HStack>
      </Box>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ecf0f1',
  },
});

export default Design;
