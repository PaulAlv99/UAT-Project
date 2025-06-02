import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image,
  SafeAreaView, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../ThemeContext';
import NavBar from '../components/Navbar';
import { useFocusEffect } from '@react-navigation/native';

const socket = io(`${process.env.EXPO_PUBLIC_SOCKET_URL}`, { autoConnect: false });

const ChatScreen = () => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState('');
  const flatListRef = useRef(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const styles = getStyles(isDarkMode);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      let token = null;

      const init = async () => {
        token = await AsyncStorage.getItem('token');
        if (!token) return;

        const meRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const meData = await meRes.json();

        if (meData.success && isMounted) {
          const user = meData.user;
          setUserId(user._id);
          socket.auth = { token };
          socket.connect();
          socket.emit('join', user._id);
        }

        const usersRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/users/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersRes.json();
        if (isMounted) {
          setUsers(usersData.users);
        }
      };

      const handleReceiveMessage = (msg) => {
        if (
          selectedUser &&
          ((msg.senderId === selectedUser._id && msg.receiverId === userId) ||
            (msg.senderId === userId && msg.receiverId === selectedUser._id))
        ) {
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.timestamp === msg.timestamp && last.message === msg.message) return prev;
            return [...prev, {
              ...msg,
              incoming: msg.senderId !== userId
            }];
          });
        }
      };

      init();
      socket.on('onlineUsers', (userIds) => {
        if (isMounted) setOnlineUsers(new Set(userIds));
      });
      socket.on('receiveMessage', handleReceiveMessage);

      return () => {
        isMounted = false;
        socket.off('onlineUsers');
        socket.off('receiveMessage', handleReceiveMessage);
        socket.disconnect();
      };
    }, [selectedUser, userId])
  );

  const handleSend = () => {
    if (!message.trim() || !selectedUser) return;

    const msg = {
      senderId: userId,
      receiverId: selectedUser._id,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    socket.emit('sendMessage', msg);
    setMessages(prev => [...prev, { ...msg, incoming: false }]);
    setMessage('');
  };

  const renderItem = ({ item }) => {
    const isOnline = onlineUsers.has(item._id);
    return (
      <TouchableOpacity
        style={[styles.userCard, selectedUser?._id === item._id && styles.selectedCard]}
        onPress={async () => {
          setSelectedUser(item);
          setMessages([]);

          try {
            const token = await AsyncStorage.getItem('token');
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/users/messages/${item._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (data.success) {
              const loadedMessages = data.messages.map(msg => ({
                ...msg,
                incoming: msg.senderId !== userId
              }));
              setMessages(loadedMessages);
            }
          } catch (error) {
            console.error('Error loading messages:', error);
          }
        }}
      >
        {item.profileImage ? (
          <Image source={{ uri: `data:image/jpeg;base64,${item.profileImage}` }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.initials}>{item.username.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={[styles.status, { color: isOnline ? 'limegreen' : 'gray' }]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavBar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      <View style={styles.content}>
        <Text style={styles.title}>Chat with Users</Text>

        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />

        {selectedUser && (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <View style={{
                  alignSelf: item.incoming ? 'flex-start' : 'flex-end',
                  backgroundColor: item.incoming ? '#ddd' : '#ffcc00',
                  padding: 10,
                  borderRadius: 10,
                  marginVertical: 5,
                  maxWidth: '80%',
                }}>
                  <Text>{item.message}</Text>
                </View>
              )}
              style={{ marginVertical: 10 }}
            />

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.chatBox}
            >
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#ffffff' },
  content: { flex: 1, paddingTop: 16, paddingHorizontal: 16 },
  title: { fontSize: 26, fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#111111', marginBottom: 16, textAlign: 'center' },
  list: { paddingBottom: 10 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: isDarkMode ? '#1e1e1e' : '#f0f0f0', borderRadius: 10, padding: 12, marginBottom: 10 },
  selectedCard: { borderColor: '#ffcc00', borderWidth: 2 },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 16 },
  avatarPlaceholder: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#999', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  initials: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  userInfo: { flex: 1 },
  username: { fontSize: 18, fontWeight: '600', color: isDarkMode ? '#eee' : '#222' },
  status: { fontSize: 14, marginTop: 2 },
  chatBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  input: { flex: 1, backgroundColor: isDarkMode ? '#333' : '#eee', padding: 10, borderRadius: 8, fontSize: 16, marginRight: 10, color: isDarkMode ? '#fff' : '#000' },
  sendButton: { backgroundColor: '#ffcc00', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
});

export default ChatScreen;
