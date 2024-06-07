"use client"
import React, { useState } from 'react'
import emailjs from '@emailjs/browser';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

const contactUs = () => {

  const {user}=useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Your EmailJS service ID, template ID, and Public Key
    const serviceId = 'service_nz7mo4p';
    const templateId = 'template_xevbgiw';
    const publicKey = 'S1rWCuglb8qMcyjfV';

    // Create a new object that contains dynamic template params
    const templateParams = {
      from_name: user?.firstName,
      from_email: user?.primaryEmailAddress?.emailAddress,
      to_name: 'expense tracker website',
      message: message,
    };
    if(templateParams){
      toast.success('Successfully sent a message!')
  } else{
    toast('Faild to send a message!')
  }

    // Send the email using EmailJS
    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('Email sent successfully!', response);
        setName('');
        setEmail('');
        setMessage('');
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  }

  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl mb-3'>Contact us</h2>
      <h2 className="text-lg text-gray-500 mb-2">I am looking forward to hear your feedback !!</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-6'>
        <div className='border p-5 rounded-lg'>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className='text-black font-medium mb-2'>Name</label>
              <Input
                type="text"
                placeholder={user?.firstName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className='text-black font-medium mb-5'>Email</label>
              <Input
                type="email"
                placeholder={user?.primaryEmailAddress?.emailAddress}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className='text-black font-medium mb-2'>Message</label>
              <textarea
                cols="30"
                rows="5"
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
            disabled={!(message)}
              type="subnit"
              className='mt-3 w-full'>Submit</Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default contactUs;
