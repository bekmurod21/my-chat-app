import React, { useEffect, useState } from 'react';
import { getUserGroups } from '../api/chat';

interface Group {
  id: string;
  name: string;
}

interface GroupListProps {
  token: string;
  onSelectGroup: (groupId: string) => void;
}

const GroupList: React.FC<GroupListProps> = ({ token, onSelectGroup }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  
  useEffect(() => {
    getUserGroups(token)
      .then(data => setGroups(data))
      .catch(err => console.error(err));
  }, [token]);

  return (
    <div style={{borderRight: '1px solid #ccc', width: '300px'}}>
      <h3>Your Groups</h3>
      <ul style={{listStyle:'none', padding:'0'}}>
        {groups.map(g => (
          <li key={g.id} style={{cursor:'pointer',padding:'5px'}} onClick={()=>onSelectGroup(g.id)}>
            {g.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupList;
