"use client"
import React from 'react';

import { Button } from '@/components/ui/button'; 
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { backendUrl } from '@/utils/url';
import { successAlert,  confirmAlert} from '@/utils/alerts';
import { useRouter } from 'next/navigation';

function ResetDatabaseButton() {

  const router = useRouter()

    const mutation = useMutation({
        mutationFn : () => axios.delete(backendUrl("restartData")),
        onSuccess : () => successAlert("data restarted")
    })

  const handleResetClick = () => {
    confirmAlert("this changes is permanent", "Reset Data" , () => {
        mutation.mutate()
    } )
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Button
        className="reset-button"
        variant={"destructive"}
        onClick={handleResetClick}
      >
        Reset Database
      </Button>

      <Button
        className="reset-button mt-2"
        variant={"outline"}
        onClick={() => router.push("/")}
      >
       back to main page
      </Button>
    </div>
  );
}

export default ResetDatabaseButton;