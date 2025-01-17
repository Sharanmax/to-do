import React from 'react';
import { View, StyleSheet, Dimensions, Platform, StyleProp, ViewStyle } from 'react-native';

const ResponsiveWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { width } = Dimensions.get('window');
    const isWeb = Platform.OS === 'web';

    // Conditional styles
    const wrapperStyle: StyleProp<ViewStyle> = isWeb && width > 600
        ? { maxWidth: 600, alignSelf: 'center', width: '100%' }
        : { width: '100%' };

    return <View style={[styles.wrapper, wrapperStyle]}>{children}</View>;
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#000', // Customize the background color
        padding: 16, // Add padding for spacing
    },
});

export default ResponsiveWrapper;
