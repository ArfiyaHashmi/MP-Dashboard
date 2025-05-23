import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ChatContext from '../../context/chatContext';
import AuthContext from '../../context/authContext';
import { Send, ArrowLeft } from 'react-feather';

const ChatPage = () => {
  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const {
    tasks,
    currentTask,
    messages,
    loading,
    error,
    fetchTasksWithChats,
    setCurrentTask,
    sendMessage
  } = chatContext;

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Fetch tasks with chats on component mount
  useEffect(() => {
    console.log('Fetching tasks with chats...');
    fetchTasksWithChats();
  }, []);

  // Log tasks when they change
  useEffect(() => {
    console.log('Tasks updated:', tasks);
  }, [tasks]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      await sendMessage(messageInput);
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageClasses = (message) => {
    const isCurrentUser = message.sender._id === user?.id;
    return isCurrentUser
      ? 'ml-auto bg-[#38a3a5] text-white'
      : 'mr-auto bg-gray-200 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-14 md:ml-56 p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Project Chats</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {/* Task List */}
            <div className="bg-white rounded-lg shadow p-4 md:col-span-1 overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Projects</h2>
              {loading && tasks.length === 0 ? (
                <p className="text-gray-500">Loading projects...</p>
              ) : tasks.length === 0 ? (
                <p className="text-gray-500">No projects available</p>
              ) : (
                <ul className="space-y-2">
                  {tasks.map((task) => (
                    <li
                      key={task._id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        currentTask?._id === task._id
                          ? 'bg-[#38a3a5] text-white'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setCurrentTask(task)}
                    >
                      <h3 className="font-medium">{task.name}</h3>
                      <p className="text-sm truncate">
                        {currentTask?._id === task._id
                          ? 'Selected'
                          : `Team: ${task.team}`}
                      </p>
                      {task.chat && (
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700 mt-2">
                          {task.chat.messageCount} messages
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Chat Area */}
            <div className="bg-white rounded-lg shadow md:col-span-3 flex flex-col">
              {currentTask ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center">
                    <button
                      onClick={() => setCurrentTask(null)}
                      className="mr-2 p-1 rounded-full hover:bg-gray-100"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h2 className="text-xl font-semibold">{currentTask.name}</h2>
                      <p className="text-sm text-gray-500">
                        Team: {currentTask.team} | Client: {currentTask.clientName}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {loading ? (
                      <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">Loading messages...</p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message._id}
                            className={`max-w-[70%] rounded-lg p-3 ${getMessageClasses(message)}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium">
                                {message.sender.name} ({message.sender.role})
                              </span>
                              <span className="text-xs ml-2">
                                {formatTimestamp(message.timestamp)}
                              </span>
                            </div>
                            <p>{message.content}</p>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#38a3a5]"
                      />
                      <button
                        type="submit"
                        className="bg-[#38a3a5] text-white p-2 rounded-r-lg hover:bg-[#2c7d7e]"
                        disabled={!messageInput.trim()}
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex flex-col justify-center items-center h-full">
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Select a project to start chatting
                  </h3>
                  <p className="text-gray-500">
                    Choose a project from the list on the left to view and send messages
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              Error: {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
