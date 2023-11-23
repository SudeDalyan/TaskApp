import React from 'react';
import {View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar, faStarHalfStroke} from '@fortawesome/free-solid-svg-icons';

const StarRating = ({rating}) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStars = Math.ceil(rating - fullStars);
  const emptyStars = totalStars - fullStars - halfStars;

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FontAwesomeIcon
        key={`full-${i}`}
        icon={faStar}
        size={18}
        color="gold"
      />,
    );
  }

  if (halfStars) {
    stars.push(
      <FontAwesomeIcon
        key="half"
        icon={faStarHalfStroke}
        size={18}
        color="gold"
      />,
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push();
  }

  return <View style={{flexDirection: 'row'}}>{stars}</View>;
};

export default StarRating;
