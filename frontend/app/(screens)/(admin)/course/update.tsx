import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AdminUpdatePage = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
          <TouchableOpacity>
            <Text>X</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Delete</Text>
          </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default AdminUpdatePage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  container: {
    flex: 1,
  },


})