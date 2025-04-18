import React from "react";

function GlobalStyles() {
  return (
    <style jsx global>{`
      .custom-scroll::-webkit-scrollbar {
        width: 8px;
      }
      
      .custom-scroll::-webkit-scrollbar-thumb {
        border-radius: 50px;
        border: 1px solid #ccc;
        background-color: #fff;
      }
      
      .custom-scroll::-webkit-scrollbar-thumb:hover {
        border: 1px solid gray;
      }
    `}</style>
  );
}

export default GlobalStyles;