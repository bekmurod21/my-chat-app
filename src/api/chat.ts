// Guruhlar ro'yxatini olish (faqat login qilingan foydalanuvchiga)
export async function getUserGroups(token: string) {
    const res = await fetch('https://localhost:7228/api/group/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if(!res.ok) throw new Error('Failed to fetch groups');
    return await res.json(); // [{id: string, name: string, ...}, ...]
  }
  
  // Guruh xabarlarini olish
  export async function getGroupMessages(token: string, groupId: string) {
    const res = await fetch(`https://localhost:7228/api/groups/${groupId}/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if(!res.ok) throw new Error('Failed to fetch messages');
    return await res.json(); // [{id: string, content: string, ...}, ...]
  }
  