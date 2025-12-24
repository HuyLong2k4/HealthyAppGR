import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

const FeatureButton = ({ icon, text }: { icon: any; text: string }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <FontAwesome5 name={icon} size={30} color="#4285F4" />
      <Text style={{ fontSize: 12, marginTop: 5, marginBottom: 10, textAlign: "center" }}>{text}</Text>
    </View>
  );
};

export default FeatureButton;
