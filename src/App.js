import React, { useEffect } from 'react';
import TextEditor from "./TextEditor";
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


function RedirectToNewDocument() {
  const navigate = useNavigate();

  useEffect(() => {
    const DocumentId = uuidv4();
    navigate(`/document/${DocumentId}`);
    
  }, [navigate]);

  return null; 
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RedirectToNewDocument /> 
  },
  {
    path: '/document/:documentId',
    element: <TextEditor />
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
