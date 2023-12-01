import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import './Components/CreatePostPage.css'

const Editor = ({content, setContent}) => {

  const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'], 
        ['blockquote', 'code-block'],

        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],     
        [{ 'indent': '-1'}, { 'indent': '+1' }],      

        [{ 'color': [] }],         
        [{ 'align': [] }],

        ['clean']                             
    ],
    clipboard: {
        matchVisual: false
    }
  };

  const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'blockquote', 'code-block',
        'list', 'script',
        'indent',
        'color', 'align', 'clean'
  ];

  return (
        <div className='editor_container'>
            <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
            />
        </div>
  );
};

export default Editor;
