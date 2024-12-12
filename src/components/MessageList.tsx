import React, { useEffect, useState } from 'react';
import { getGroupMessages } from '../api/chat';

interface Message {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

interface MessageListProps {
  token: string;
  groupId: string;
}

const MessageList: React.FC<MessageListProps> = ({ token, groupId }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(()=>{
    if(groupId){
      getGroupMessages(token, groupId)
        .then(data => setMessages(data))
        .catch(err => console.error(err));
    }
  },[groupId, token]);

  if(!groupId) {
    return <div style={{flex:'1',padding:'20px'}}>Select a group to start messaging</div>;
  }

  return (
    <div style={{flex:'1',padding:'20px'}}>
      <h3>Messages in group {groupId}</h3>
      <div style={{height:'400px', overflowY:'scroll', border:'1px solid #ccc',padding:'10px'}}>
        {messages.map(m => (
          <div key={m.id} style={{marginBottom:'10px'}}>
            <strong>{m.userId}:</strong> {m.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessageList;
