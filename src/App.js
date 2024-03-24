import React, { useState } from 'react';
import './App.css';

function App() {
  const [result, setResult] = useState('');

  // Function to analyze JSON data and extract unique tags
  const analyzeJSON = (jsonData) => {
    const matchingTagsSet = new Set();

    for (const data of jsonData) {
      if (data.elements && Array.isArray(data.elements)) {
        for (const element of data.elements) {
          if (element.tags && Array.isArray(element.tags)) {
            for (const step of element.steps) {
              if (step.result && step.result.status === 'failed') {
                const tesTags = element.tags.filter(tag => tag.name.startsWith('@TES-')).map(tag => tag.name);
                tesTags.forEach(tag => matchingTagsSet.add(tag));
              }
            }
          }
        }
      } else {
        console.error('JSON data is not in the expected format.');
      }
    }

    return Array.from(matchingTagsSet);
  };

  // Event handler for file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        const uniqueMatchingTags = analyzeJSON(jsonData);
        const formattedTags = uniqueMatchingTags.join(' or ');
        setResult(`Unique tags associated with failed steps and starting with '@TES-': ${formattedTags}`);
      } catch (error) {
        console.error('Error reading JSON file:', error);
        setResult('Error reading JSON file. Please try again.');
      }
    };

    reader.readAsText(file);
  };

  // Event handler for drag over
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Event handler for file drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        const uniqueMatchingTags = analyzeJSON(jsonData);
        const formattedTags = uniqueMatchingTags.join(' or ');
        setResult(`Unique tags associated with failed steps and starting with '@TES-': ${formattedTags}`);
      } catch (error) {
        console.error('Error reading JSON file:', error);
        setResult('Error reading JSON file. Please try again.');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="App">
      <h1>Cucumber Failed Test ID Extractor</h1>
      <div className="file-upload" onDragOver={handleDragOver} onDrop={handleDrop}>
        <p>Drag and drop your JSON file here, or click to browse</p>
        <input type="file" onChange={handleFileUpload} accept=".json" />
      </div>
      <div id="output">{result}</div>
    </div>
  );
}

export default App;
