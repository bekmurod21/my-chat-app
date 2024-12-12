import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatPage.css';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';

interface Group {
  id: string;
  name: string;
}

interface Message {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if(!token) {
    navigate('/login');
  }

  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // Endi guruhlarni ham SignalR yoki boshqa usulda olish kerak. Agar guruhlar ham real-time bo'lishini istasangiz,
  // hub orqali olishingiz mumkin. Agar faqat xabarlarni real-time qilmoqchi bo'lsangiz, guruhlarni REST orqali ham qoldirish mumkin.
  // Mana bu misolda guruhlarni ham hub orqali olishni ko'rsatamiz (agar hubda shunday metod bo'lsa).
  // Aks holda, guruhlarni REST API orqali olish qoldirishingiz mumkin.

  useEffect(() => {
    if(token && userId) {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`http://localhost:7228/chathub?userId=${userId}`, {
          accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build();

      newConnection.start()
        .then(async () => {
          console.log('Connected to chatHub');
          // Bu yerda agar hubda guruhlarni olish metodi bo'lsa shuni chaqirishingiz mumkin.
          // Faraz qilamiz hub da GetUserGroups metodi bor:
          const grp: {id:string,name:string}[] = await newConnection.invoke('GetAllGroupAsync');
          setGroups(grp);
        })
        .catch((err: any) => console.error('Connection failed: ', err));

      // Xabar qabul qilish eventini sozlash
      newConnection.on('ReceiveMessage', (msg: {MessageId: string, Content: string, UserId: string, CreatedAt: string}) => {
        if(msg) {
          setMessages(prev => [...prev, {
            id: msg.MessageId,
            content: msg.Content,
            userId: msg.UserId,
            createdAt: msg.CreatedAt
          }]);
        }
      });

      newConnection.on('MessageEdited', (msg: {MessageId: string, Content: string, UpdatedAt: string}) => {
        setMessages(prev => prev.map(m => m.id === msg.MessageId ? {...m, content: msg.Content} : m));
      });

      setConnection(newConnection);
    }
  }, [token, userId]);

  useEffect(()=>{
    // Har safar guruh o'zgarganda JoinGroup va eski xabarlarni olish
    const loadMessages = async () => {
      if(connection && selectedGroupId) {
        // Avval oldingi guruhdan chiqamiz
        if(selectedGroupId) {
          await connection.invoke('LeaveGroup', selectedGroupId).catch((err: any)=>console.error(err));
        }
        // Yangi guruhga qo'shilish
        await connection.invoke('JoinGroup', selectedGroupId)
          .catch((err: any) => console.error('JoinGroup error:', err));

        // Eski xabarlarni olish
        const oldMessages: {
          MessageId: string,
          Content: string,
          UserId: string,
          CreatedAt: string
        }[] = await connection.invoke('GetGroupMessages', selectedGroupId);

        const mapped = oldMessages.map(m => ({
          id: m.MessageId,
          content: m.Content,
          userId: m.UserId,
          createdAt: m.CreatedAt
        }));
        setMessages(mapped);
      }
    };

    loadMessages();
  },[connection, selectedGroupId]);

  const handleGroupSelect = (gid: string) => {
    setSelectedGroupId(gid);
  };

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentGroup = groups.find(g => g.id === selectedGroupId);

  const handleSendMessage = async () => {
    if(connection && selectedGroupId && newMessage.trim().length > 0) {
      await connection.invoke('SendMessageToGroup', selectedGroupId, newMessage)
        .catch((err: any)=>console.error(err));
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-header">My Groups</div>
        <div className="sidebar-search">
          <input 
            type="text" 
            placeholder="Search groups..." 
            value={searchTerm} 
            onChange={e=>setSearchTerm(e.target.value)}
          />
        </div>
        <div className="groups-list">
          <ul>
            {filteredGroups.map(g => (
              <li 
                key={g.id} 
                className={g.id === selectedGroupId ? 'active' : ''} 
                onClick={()=>handleGroupSelect(g.id)}
              >
                {g.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="chat-area">
        <div className="chat-header">
          <h3>{currentGroup ? currentGroup.name : 'Select a group'}</h3>
        </div>
        <div className="messages-list">
          {messages.map(m => (
            <div key={m.id} className={`message ${m.userId === userId ? 'me' : ''}`}>
              <div>{m.content}</div>
              <div className="message-info">{new Date(m.createdAt).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
        {selectedGroupId && 
          <div className="chat-input">
            <input 
              type="text" 
              placeholder="Type a message..."
              value={newMessage}
              onChange={e=>setNewMessage(e.target.value)}
              onKeyDown={e=> e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        }
      </div>
    </div>
  );
};

export default ChatPage;
