import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';

const MessagePage = () => {
    return (
        <View style={styles.container}>
            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Trò chuyện</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tab, styles.tabActive]}>
                    <Text style={styles.tabTextActive}>Tất cả tin nhắn (69)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Tin nhắn mới (69)</Text>
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <TextInput placeholder="Search here.." style={styles.searchInput} />
            </View>

            {/* Messages list */}
            <ScrollView style={styles.messageList}>
                {dummyMessages.map((msg, index) => (
                    <View key={index} style={styles.messageItem}>
                        <Image source={{ uri: msg.avatar }} style={styles.avatar} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.name}>{msg.name}</Text>
                            <Text style={styles.message}>{msg.message}</Text>
                            <View style={styles.adminTag}>
                                <Image source={{ uri: msg.avatar }} style={styles.adminAvatar} />
                                <Text style={styles.adminText}>Kiet Lac Admin</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text style={styles.time}>12m</Text>
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>{msg.unread}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default MessagePage;

const dummyMessages = [
    {
        name: "Nguyen Quynh",
        message: "Nguyen Quynh sent a photo.",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        unread: 1,
    },
    {
        name: "Wren Evans",
        message: "Em phải tin anh chứ",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        unread: 6,
    },
    {
        name: "Jack - J97",
        message: "Hi man haha",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        unread: 1,
    },
    {
        name: "Huy Vuong",
        message: "私はダイです。いいですか？",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        unread: 2,
    },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 60,
    },
    titleContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    titleText: {
        fontSize: 20,
        fontWeight: '600',
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    tabActive: {
        backgroundColor: "#E3EEFD",
        borderColor: "#4285F4",
    },
    tabText: {
        fontSize: 14,
        color: "#333",
    },
    tabTextActive: {
        fontSize: 14,
        color: "#4285F4",
        fontWeight: "600",
    },
    searchContainer: {
        backgroundColor: "#f1f1f1",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        marginBottom: 10,
    },
    searchInput: {
        fontSize: 14,
    },
    messageList: {
        flex: 1,
    },
    messageItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    name: {
        fontWeight: "bold",
        fontSize: 16,
    },
    message: {
        fontSize: 14,
        color: "#555",
    },
    adminTag: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    adminAvatar: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 4,
    },
    adminText: {
        fontSize: 12,
        color: "#f57c00",
        fontWeight: "600",
    },
    time: {
        fontSize: 12,
        color: "#999",
        marginBottom: 4,
    },
    unreadBadge: {
        backgroundColor: "#4285F4",
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: "center",
    },
    unreadText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
});
