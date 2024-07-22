import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SpotlightButton = ({ children, isActive, onClose }) => {
  const [buttonLayout, setButtonLayout] = useState(null);

  const onButtonLayout = (event) => {
    setButtonLayout(event.nativeEvent.layout);
  };

  if (!isActive) {
    return <View onLayout={onButtonLayout}>{children}</View>;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {buttonLayout && (
            <View
              style={[
                styles.highlight,
                {
                  top: buttonLayout.y - 5,
                  left: buttonLayout.x - 5,
                  width: buttonLayout.width + 10,
                  height: buttonLayout.height + 10,
                },
              ]}
            >
              {children}
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  highlight: {
    position: 'absolute',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
});

export default SpotlightButton;