import React from 'react';
import { View, StyleSheet } from 'react-native';

const Indicator = ({ total, active }) => {
  return (
    <View style={styles.indicatorContainer}>
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            index === active ? styles.activeIndicator : null,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#007aff',
  },
});

export default Indicator;