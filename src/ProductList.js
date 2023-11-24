import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  View,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {
  faMagnifyingGlass,
  faHeart,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import {
  NativeBaseProvider,
  ScrollView,
  Box,
  HStack,
  VStack,
  Text,
  Image,
  Input,
  Card,
  Button,
  Radio,
  Divider,
} from 'native-base';
import StarRating from './StarRating';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const modalConditions = {
  Değerlendirme: [
    '5 yıldız',
    '4 yıldız ve üzeri',
    '3 yıldız ve üzeri',
    '2 yıldız ve üzeri',
  ],
  Fiyat: ['1000 ₺ ve üzeri', '100 ₺ - 1000 ₺', '0 ₺ - 100 ₺'],
  Kategori: [
    'smartphones',
    'laptops',
    'fragrances',
    'skincare',
    'groceries',
    'home-decoration',
    'furniture',
    'sunglasses',
    'automotive',
    'motorcycle',
    'lighting',
  ],
};

const ProductList = () => {
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ['40%', '80%'];
  const [productList, setProductList] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedRadio, setSelectedRadio] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = (searchProduct = '') => {
    let uri;
    if (selectedRadio !== null) {
      uri = `https://dummyjson.com/products/category/${selectedRadio}`;
    } else {
      uri = `https://dummyjson.com/products/search?q=${searchProduct}`;
    }
    fetch(uri)
      .then(res => res.json())
      .then(data => {
        setProductList(data.products);
      })
      .catch(error => {
        console.error('Error fetching products: ', error);
      });
  };

  const renderProductsRows = () => {
    const rows = [];
    if (productList !== undefined) {
      for (let i = 0; i < productList.length; i += 2) {
        if (i + 1 < productList.length) {
          rows.push(
            <HStack key={i} space={2} justifyContent="space-between">
              {renderProductCard(productList[i])}
              {renderProductCard(productList[i + 1])}
            </HStack>,
          );
        } else {
          rows.push(
            <HStack key={i} space={2} justifyContent="space-between">
              {renderProductCard(productList[i])}
              <Box flex={1} />
            </HStack>,
          );
        }
      }
      return rows;
    }
  };

  const renderProductCard = product => {
    return (
      <TouchableOpacity key={product.id}>
        <Card
          width={screenWidth * 0.46}
          rounded={5}
          elevation={5}
          backgroundColor="white"
          mb={4}
          padding={0}>
          {/* Ürün kartı içeriği */}
          <TouchableOpacity
            key={product.id}
            onPress={() => handleProductClick(product, navigation)}>
            <Card
              width={screenWidth * 0.46}
              rounded={5}
              elevation={5}
              backgroundColor="white"
              mb={4}
              padding={0}>
              {/* Ürün kartı içeriği */}
              <VStack space={2} position="relative">
                <Image
                  source={{
                    uri: product.thumbnail,
                  }}
                  alt="Product Image"
                  size="xl"
                  resizeMode="cover"
                  width="100%"
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 10,
                    zIndex: 1,
                  }}
                  //onPress={() => this.handleLikeClick()}
                >
                  <FontAwesomeIcon icon={faHeart} size={18} color="#f4f4f5" />
                </TouchableOpacity>

                <VStack space={2} padding={2} alignItems="left" mt={-4}>
                  <Text fontWeight="bold" fontSize="lg" color="gray.800">
                    {product.price} ₺
                  </Text>
                  <Text fontSize="xs" color="gray.600" numberOfLines={2}>
                    {product.description}
                  </Text>
                  <HStack justifyContent="space-between" alignItems="center">
                    <StarRating rating={product.rating} />
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      numberOfLines={2}
                      ml={2}>
                      ({product.stock})
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </Card>
          </TouchableOpacity>
        </Card>
      </TouchableOpacity>
    );
  };

  const handleProductSearch = searchProduct => {
    if (selectedRadio !== null) {
      let filteredProducts = productList;
      if (selectedRadio.includes('₺')) {
        //fiyata göre filtreleme
        //case-case tüm fiyatları filtreleyebilirsiniz
        filteredProducts = productList.filter(
          product => parseFloat(product.price) >= 1000,
        );
        setProductList(filteredProducts);
      } else if (selectedRadio.includes('yıldız')) {
        //değerlendirmeye göre filtreleme
        //case-case tüm değerlendirmeleri filtreleyebilirsiniz
        filteredProducts = productList.filter(
          product => parseFloat(product.rating) >= 4,
        );
        setProductList(filteredProducts);
      } else {
        fetchProducts(searchProduct);
      }
    } else {
      fetchProducts(searchProduct);
    }
  };

  const renderRadioButtons = () => {
    if (selectedButton && modalConditions[selectedButton]) {
      return (
        <View padding={screenWidth * 0.05}>
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            {selectedButton}
          </Text>
          <Divider
            bg="gray.800"
            opacity="0.2"
            mt={screenHeight * 0.01}
            mb={screenHeight * 0.02}
          />
          <Radio.Group
            defaultValue="1"
            name="myRadioGroup"
            value={selectedRadio}
            onChange={value => setSelectedRadio(value)}>
            {modalConditions[selectedButton].map((value, index) => (
              <Radio key={index} value={value} my={1}>
                {value}
              </Radio>
            ))}
          </Radio.Group>
          <HStack
            space={2}
            justifyContent="space-between"
            mt={screenHeight * 0.05}>
            <Button
              size="md"
              variant="outline"
              rounded={18}
              width={screenWidth * 0.3}
              _text={{color: 'gray.800'}}
              onPress={() => {
                handleProductSearch();
                bottomSheetModalRef.current?.close();
              }}>
              Temizle
            </Button>
            <Button
              size="md"
              variant="outline"
              rounded={18}
              width={screenWidth * 0.6}
              bg="gray.800"
              _text={{color: 'white'}}
              onPress={() => {
                handleProductSearch(selectedRadio);
                bottomSheetModalRef.current?.close();
              }}>
              Sonuçları Göster
            </Button>
          </HStack>
        </View>
      );
    }

    return null;
  };

  const handleButtonPress = buttonType => {
    bottomSheetModalRef.current?.present();
    setSelectedButton(buttonType);
    setSelectedRadio(null);
  };

  const handleProductClick = (product, navigation) => {
    navigation.navigate('ProductScreen', {productData: product});
  };

  return (
    <NativeBaseProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <BottomSheetModalProvider>
          <SafeAreaView
            style={{
              marginHorizontal: 10,
              backgroundColor: 'white',
              marginHorizontal: 0,
            }}>
            <Input
              variant="filled"
              rounded={18}
              m={2}
              placeholder="Dilediğini ara"
              InputLeftElement={
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  color="#27272a"
                  style={{marginLeft: 10}}
                />
              }
              onChangeText={handleProductSearch}
            />
            <HStack space={2} m={2}>
              <Button
                size="xs"
                variant="outline"
                rounded={18}
                colorScheme="gray.800"
                onPress={() => handleButtonPress('Değerlendirme')}
                endIcon={
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    color="#27272a"
                    size={10}
                  />
                }>
                Değerlendirme
              </Button>
              <Button
                size="xs"
                variant="outline"
                rounded={18}
                colorScheme="gray.800"
                onPress={() => handleButtonPress('Fiyat')}
                endIcon={
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    color="#27272a"
                    size={10}
                  />
                }>
                Fiyat
              </Button>
              <Button
                size="xs"
                variant="outline"
                rounded={18}
                colorScheme="gray.800"
                onPress={() => handleButtonPress('Kategori')}
                endIcon={
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    color="#27272a"
                    size={10}
                  />
                }>
                Kategori
              </Button>
            </HStack>
          </SafeAreaView>

          <BottomSheetModal
            ref={bottomSheetModalRef}
            height={screenHeight}
            index={1}
            snapPoints={snapPoints}>
            {renderRadioButtons()}
          </BottomSheetModal>

          <ScrollView style={styles.container}>
            {renderProductsRows()}
          </ScrollView>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f4f5',
  },
});

export default ProductList;
