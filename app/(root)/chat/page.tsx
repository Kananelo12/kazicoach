import React from 'react';
import { getCurrentUser } from '@/lib/actions/auth.action';
import Agent from '@/components/Agent';

const page = async () => {
const user = await getCurrentUser();
  return (
    <>
        <h3>Chat with KaziCoach Assistant</h3>

        <Agent
            userName="Joel"
            userId={user?.id}
            type="generate"
        />
    </>
  )
}

export default page