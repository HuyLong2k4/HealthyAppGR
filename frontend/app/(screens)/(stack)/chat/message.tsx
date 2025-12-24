import { useChat } from '@/context/ChatContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const MessagePage = () => {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const [inputText, setInputText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Handle keyboard show/hide for Android
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSend = () => {
    if (inputText.trim() && !isLoading) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  // const handleClearChat = () => {
  //   Alert.alert(
  //     'Xóa lịch sử chat',
  //     'Bạn có chắc muốn xóa toàn bộ lịch sử trò chuyện?',
  //     [
  //       { text: 'Hủy', style: 'cancel' },
  //       { 
  //         text: 'Xóa', 
  //         style: 'destructive',
  //         onPress: clearChat 
  //       }
  //     ]
  //   );
  // };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={styles.container}>
      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.welcomeHeader}>
            <View style={styles.welcomeIconContainer}>
              <Ionicons name="sparkles" size={32} color="#4285F4" />
            </View>
            <Text style={styles.welcomeTitle}>Trợ lý AI Sức khỏe</Text>
            <Text style={styles.welcomeSubtitle}>Hãy đặt câu hỏi về sức khỏe của bạn</Text>
            {/* {messages.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={handleClearChat}
              >
                <Ionicons name="trash-outline" size={20} color="#FF5252" />
                <Text style={styles.clearButtonText}>Xóa lịch sử</Text>
              </TouchableOpacity>
            )} */}
          </View>
        }
        ListFooterComponent={
          isLoading ? (
            <View style={styles.loadingWrapper}>
              <View style={styles.aiAvatar}>
                <Ionicons name="sparkles" size={16} color="#fff" />
              </View>
              <View style={styles.loadingBubble}>
                <ActivityIndicator size="small" color="#4285F4" />
                <Text style={styles.loadingText}>AI đang suy nghĩ...</Text>
              </View>
            </View>
          ) : null
        }
        contentContainerStyle={styles.messagesContent}
        renderItem={({ item: message }) => (
          <View 
            style={[
              styles.messageWrapper,
              message.sender === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper
            ]}
          >
            {message.sender === 'ai' && (
              <View style={styles.aiAvatar}>
                <Ionicons name="sparkles" size={16} color="#fff" />
              </View>
            )}
            
            <View 
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userBubble : styles.aiBubble,
                message.isError && styles.errorBubble
              ]}
            >
              <Text 
                style={[
                  styles.messageText,
                  message.sender === 'user' ? styles.userText : styles.aiText
                ]}
              >
                {message.text}
              </Text>
              <Text 
                style={[
                  styles.timestamp,
                  message.sender === 'user' ? styles.userTimestamp : styles.aiTimestamp
                ]}
              >
                {formatTime(message.timestamp)}
              </Text>
            </View>

            {message.sender === 'user' && (
              <View style={styles.userAvatar}>
                <Ionicons name="person" size={16} color="#fff" />
              </View>
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={15}
      />

      {/* Input */}
      <View style={[styles.inputContainer, { bottom: keyboardHeight > 0 ? keyboardHeight : 0 }]}>
        <TextInput
          style={styles.input}
          placeholder="Nhập câu hỏi của bạn..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          editable={!isLoading}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            (!inputText.trim() || isLoading) && styles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Ionicons 
            name={isLoading ? "hourglass-outline" : "send"} 
            size={22} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessagePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  welcomeHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  welcomeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E3F2FD",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: "#333",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  clearButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#FF5252',
    fontWeight: '600',
  },
  messagesContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 90,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: "#4285F4",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  errorBubble: {
    backgroundColor: "#FFEBEE",
    borderWidth: 1,
    borderColor: "#FF5252",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: "#fff",
  },
  aiText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  userTimestamp: {
    color: "rgba(255,255,255,0.7)",
    textAlign: 'right',
  },
  aiTimestamp: {
    color: "#999",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4285F4",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#34A853",
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  loadingWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  loadingBubble: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
    fontStyle: 'italic',
  },
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    alignItems: 'flex-end',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4285F4",
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
});
