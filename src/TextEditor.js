import React, { useCallback,useEffect,useState } from 'react'
import Quill from "quill";
import "quill/dist/quill.snow.css"
import "./TextEditor.css" 
import {io} from "socket.io-client"
import { useParams } from 'react-router-dom';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];

export default function TextEditor() {
  const {documentId} = useParams()
  const [quill,setQuill] = useState(null)
  const [socket,setSocket] = useState(null)
  
  useEffect(() => {

    const s = io("http://localhost:3001")
    setSocket(s)

    return () =>{
      s.disconnect()
    }
  },[]) // connects front-end to server

  useEffect(() =>{
    if (socket == null|| quill == null ) return
    socket.once('load-document' ,document =>{
      quill.setContents(document)
      quill.enable()
    })

    socket.emit("get-document",documentId)
  },[socket,quill,documentId])

  useEffect(() =>{
    if (socket == null|| quill == null ) return
      
    function handler(delta,oldDelta,source){
      if (source !== 'user') return
      socket.emit('send-changes',delta)
    }

    quill.on('text-change',handler)

      return() =>{
        quill.off('text-change',handler )
      }

  },[socket,quill]) //sends update to server

  useEffect(() =>{
      if (socket == null|| quill == null ) return
        
      function handler(delta,oldDelta,source){
        quill.updateContents(delta)
      }
  
      socket.on('recieve-changes',handler)
  
        return() =>{
          socket.off('recieve-changes',handler )
        }
  
  },[socket,quill]) //recieves update from server and updates quill

  useEffect(()=>{
    if (socket == null|| quill == null ) return

    const interval = setInterval(()=>{
      socket.emit('save-document', quill.getContents())
    },2000)

    return () =>{
      clearInterval(interval)
    }
  },[socket,quill])
  

  const wrapperRef =  useCallback((wrapper) =>{
    if(wrapper == null)return;

    wrapper.innerHTML = ""

    let editor = document.createElement("div")

    wrapper.append(editor)

    let q = new Quill(editor, {
      theme: 'snow', modules : {toolbar : toolbarOptions} 
    });
    q.disable()
    q.setText('loading...')
    setQuill(q)

  },[])
    

  
  return (
    <div className = 'container' ref = {wrapperRef}></div>
  )
}
