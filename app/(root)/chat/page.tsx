import React from 'react';
import { getCurrentUser } from '@/lib/actions/auth.action';
import Agent from '@/components/Agent';

const page = async () => {
const user = await getCurrentUser();
  return (
    <div className='root-layout'>
        <h3>Chat with KaziCoach Assistant</h3>

        <Agent
            userName={user!.name}
            userId={user?.id}
            type="generate"
        />
    </div>
  )
}

export default page