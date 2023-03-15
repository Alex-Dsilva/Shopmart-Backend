import { StarIcon } from '@chakra-ui/icons'
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from 'react';
import { Box, Stack, Heading, Text, Image, Button, Skeleton, Grid, Flex, filter } from '@chakra-ui/react';
import { getProducts, addToCart } from '../../redux/App/AppAction';
import { ChakraProvider } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Filter from "./Filter"


const ProductSkeleton = () => {
  return (
    <Box maxW="sm" borderWidth="1px" rounded="lg" overflow="hidden">
      <Skeleton height="200px">
        <Image />
      </Skeleton>
      <Box p="6">
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
        <Stack isInline justifyContent="center" mt="auto">
          <Skeleton height="20px" width="40%" />
        </Stack>
      </Box>
    </Box>
  );
};


const Products = ({ title }) => {


  const { products, isLoading, searchQuery } = useSelector(state => state.Appreducer);
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = React.useState(false)
  // alert(`${isLoading}`)
  useEffect(() => {
    dispatch(getProducts(searchQuery));
  }, [searchQuery, dispatch]);

  const handleAddToCart = product => {
    dispatch(addToCart(product));
  };

  // useEffect(() => {
  //   console.log(searchQuery)
  //   dispatch(getProducts(searchQuery));
  // }, [searchQuery]);

  // if (isLoading) {
  //   return (
  //     <Stack spacing={5}>
  //       {Array.from({ length: 10 }, (_, i) => (
  //         <Box p={5} shadow="md" borderWidth="1px">
  //           <Skeleton height="20px" my="10px" />
  //           <Skeleton height="20px" my="10px" />
  //           <Skeleton height="20px" my="10px" />
  //         </Box>
  //       ))}
  //     </Stack>
  //   );
  // }


  return (
    <ChakraProvider>
      <Box id="pro" mt="90px">
        <Heading className="title" as="h1">
          {title || "Products"}
        </Heading>
        {isLoading ? (
          <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(4, 1fr)"]} gap={6} p="20px">
            {Array.from({ length: 10 }, (_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </Grid>

        ) : (
          <Flex>
            <Filter products={products} />
            <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(4, 1fr)"]} gap={7} p="25px" >
              {products.map((product, index) => {
                const discount=Math.floor(Math.random() * (70 - 5 + 1)) + 5
                let discounted_price = product.price - (product.price * (discount / 100));
                return (
                  // <ProductCard key={index} product={product} onAddToCart={handleAddToCart} />
                  <Flex flexDir="column" gap={3} p={5} borderRadius="10px" shadow="md"
                    overflow="hidden"
                    _hover={{ transform: 'scale(1.1)' }}
                    transition="all 0.3s ease-in-out" borderWidth="1px">
                    <Image src={product.image_url} alt={product.name} />
                    <Text fontWeight="bold">{product.name}</Text>

                    <Text>
                      <b>₹{discounted_price.toFixed(0)  || 2549} </b>{" "}
                      <s> ₹{product.price || 249}</s>{" "}
                    </Text>
                    <Text fontWeight="bold">
                      {Array(5)
                        .fill('')
                        .map((_, i) => (
                          <StarIcon
                            key={i}
                            color={i < product.rating ? 'yellow.400' : 'gray.300'}
                          />
                        )) || "No Reviews"}   {product.ratingCount}

                    <Text as="span" color="green.500">
                        {discount}
                    </Text>
                    </Text>
                    <Button onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </Button>
                  </Flex>
                )
              })}
            </Grid>
          </Flex>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default Products;
