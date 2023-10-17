# What is this?

This Library is for the sole purpose of Signing Documents on the fly electronically.

# Installation

`npm i docusign-jsx -- save`

## How do I use it?

Then How to use for example

```
import React from 'react';
import { createSignatureModal, addImageToWordDocument, convertWordToPDF } from 'docusign-jsx';

class SignatureComponent extends React.Component {
  handleCreateSignatureModal = () => {
    createSignatureModal();
  };

  handleAddImageToWordDocument = () => {
    // Specify the file path where you want to save the Word document
    const filePath = 'path/to/your_word_document.docx';

    // Call the addImageToWordDocument function from the package
    addImageToWordDocument(filePath);
  };

  handleConvertWordToPDF = () => {
    // Specify the file paths for input Word document and output PDF document
    const docxFilePath = 'path/to/your_word_document.docx';
    const pdfFilePath = 'path/to/your_output_pdf.pdf';

    // Call the convertWordToPDF function from the package
    convertWordToPDF(docxFilePath, pdfFilePath);
  };

  render() {
    return (
      <div>
        <button onClick={this.handleCreateSignatureModal}>Open Signature Modal</button>
        <button onClick={this.handleAddImageToWordDocument}>Add Image to Word</button>
        <button onClick={this.handleConvertWordToPDF}>Convert Word to PDF</button>
      </div>
    );
  }
}

export default SignatureComponent;

```