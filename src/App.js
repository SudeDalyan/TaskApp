import React, {Component} from 'react';
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
  RadioGroup,
  Radio,
} from 'native-base';
import StarRating from './StarRating';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const modalConditions = {
  degerlendirme: [
    '5 yıldız',
    '4 yıldız ve üzeri',
    '3 yıldız ve üzeri',
    '2 yıldız ve üzeri',
  ],
  fiyat: ['1000 ₺ ve üzeri', '100 ₺ - 1000 ₺', '0 ₺ - 100 ₺'],
  kategori: [
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
class ProductList extends Component {
  constructor(props) {
    super(props);
    this.bottomSheetModalRef = React.createRef();
    this.snapPoints = ['40%', '80%'];
    this.state = {
      productList: [],
      selectedButton: null,
      selectedRadio: null,
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = (searchProduct = '') => {
    if (this.state.selectedRadio !== null) {
      //kategoriye göre filtreleme
      var uri = `https://dummyjson.com/products/category/${this.state.selectedRadio}`;
    } else {
      //ürürn arama
      uri = `https://dummyjson.com/products/search?q=${searchProduct}`;
    }
    fetch(uri)
      .then(res => res.json())
      .then(data => {
        this.setState({productList: data.products});
      })
      .catch(error => {
        console.error('Error fetching products: ', error);
      });
  };

  renderProductsRows = () => {
    const {productList} = this.state;
    const rows = [];
    if (productList !== undefined) {
      for (let i = 0; i < productList.length; i += 2) {
        if (i + 1 < productList.length) {
          rows.push(
            <HStack key={i} space={2} justifyContent="space-between">
              {this.renderProductCard(productList[i])}
              {this.renderProductCard(productList[i + 1])}
            </HStack>,
          );
        } else {
          rows.push(
            <HStack key={i} space={2} justifyContent="space-between">
              {this.renderProductCard(productList[i])}
              <Box flex={1} />
            </HStack>,
          );
        }
      }
      return rows;
    }
  };

  renderProductCard = product => {
    return (
      <TouchableOpacity
        key={product.id}
        onPress={() => this.handleProductClick(product)}>
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
                <Text fontSize="xs" color="gray.600" numberOfLines={2} ml={2}>
                  ({product.stock})
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </Card>
      </TouchableOpacity>
    );
  };

  handleProductSearch = searchProduct => {
    if (this.state.selectedRadio !== null) {
      let filteredProducts = this.state.productList;
      if (this.state.selectedRadio.includes('₺')) {
        //fiyata göre filtreleme
        //case-case tüm fiyatları filtreleyebilirsiniz
        filteredProducts = this.state.productList.filter(
          product => parseFloat(product.price) >= 1000,
        );
        this.setState({productList: filteredProducts});
      } else if (this.state.selectedRadio.includes('yıldız')) {
        //değerlendirmeye göre filtreleme
        //case-case tüm değerlendirmeleri filtreleyebilirsiniz
        filteredProducts = this.state.productList.filter(
          product => parseFloat(product.rating) >= 4,
        );
        this.setState({productList: filteredProducts});
      } else {
        this.fetchProducts(searchProduct);
      }
    } else {
      this.fetchProducts(searchProduct);
    }
  };

  handleProductClick = product => {
    console.log('Tıklanan ürün:', product);
  };

  renderRadioButtons = () => {
    const {selectedButton, selectedRadio} = this.state;
    if (selectedButton && modalConditions[selectedButton]) {
      return (
        <View padding={screenWidth * 0.05}>
          <Radio.Group
            defaultValue="1"
            name="myRadioGroup"
            value={selectedRadio}
            onChange={value => this.setState({selectedRadio: value})}>
            {modalConditions[selectedButton].map((value, index) => (
              <Radio key={index} value={value} my={1}>
                {value}
              </Radio>
            ))}
          </Radio.Group>
          <HStack space={2} justifyContent="space-between" mt={screenHeight*0.05}>
            <Button
              size="md"
              variant="outline"
              rounded={18}
              width={screenWidth * 0.3}
              _text={{color: 'gray.800'}}
              onPress={() => {
                this.handleProductSearch();
                this.bottomSheetModalRef.current?.close();
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
                this.handleProductSearch(this.state.selectedRadio);
                this.bottomSheetModalRef.current?.close();
              }}>
              Sonuçları Göster
            </Button>
          </HStack>
        </View>
      );
    }

    return null;
  };

  handleButtonPress = buttonType => {
    this.bottomSheetModalRef.current?.present();
    this.setState({
      selectedButton: buttonType,
      selectedRadio: null,
    });
  };

  render() {
    return (
      <NativeBaseProvider>
        <GestureHandlerRootView style={{flex: 1}}>
          <BottomSheetModalProvider>
            <SafeAreaView style={{marginHorizontal: 10}}>
              <Input
                variant="filled"
                rounded={18}
                placeholder="Dilediğini ara"
                InputLeftElement={
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    color="#27272a"
                    style={{marginLeft: 10}}
                  />
                }
                onChangeText={this.handleProductSearch}
              />
              <HStack space={2} marginY={2}>
                <Button
                  size="xs"
                  variant="outline"
                  rounded={18}
                  colorScheme="gray.800"
                  onPress={() => this.handleButtonPress('degerlendirme')}
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
                  onPress={() => this.handleButtonPress('fiyat')}
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
                  onPress={() => this.handleButtonPress('kategori')}
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
              ref={this.bottomSheetModalRef}
              height={screenHeight}
              index={1}
              snapPoints={this.snapPoints}>
              {this.renderRadioButtons()}
            </BottomSheetModal>

            <ScrollView style={styles.container}>
              {this.renderProductsRows()}
            </ScrollView>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </NativeBaseProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f4f5',
  },
});

export default ProductList;
