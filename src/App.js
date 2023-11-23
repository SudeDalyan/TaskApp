import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHeart} from '@fortawesome/free-solid-svg-icons';
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
} from 'native-base';
import StarRating from './StarRating';

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = () => {
    fetch(`https://dummyjson.com/products`)
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
  };

  renderProductCard = product => {
    return (
      <TouchableOpacity
        key={product.id}
        onPress={() => this.handleProductClick(product)}>
        <Card width="165" rounded={5} backgroundColor="white" m={2} padding={0}>
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

  handleProductClick = product => {
    console.log('Tıklanan ürün:', product);
  };

  render() {
    return (
      <NativeBaseProvider>
        <ScrollView style={styles.container}>
          {this.renderProductsRows()}
        </ScrollView>
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
