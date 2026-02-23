import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';

const CButton = ({ children }: { children: string }) => {
  return (
    <button className='px-4 py-2 rounded-md bg-foreground hover:bg-muted hover:text-muted-foreground cursor-pointer'>
      {children}
    </button>
  );
};

export default CButton;
