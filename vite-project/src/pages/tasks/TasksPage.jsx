import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios'; // Assuming you're using axios for API calls
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Board from '../../components/Board';
import Editable from '../../components/Editable';
import AuthContext from '../../context/authContext';

function TasksPage() {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user, token } = authContext; // Assuming your auth context provides the auth token

  
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [targetCard, setTargetCard] = useState({
    bid: "",
    cid: "",
  });

  // Fetch boards from the backend when component mounts or user changes
  useEffect(() => {
    const fetchBoards = async () => {
      if (!isAuthenticated || !user || !token) {
        setBoards([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Configure headers with auth token
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };
        
        // Fetch boards for the current user
        const response = await axios.get('/api/boards', config);
        setBoards(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching boards:', err);
        // setError('Failed to load your boards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [isAuthenticated, user, token]);

  // Save boards to backend whenever they change
  const saveBoards = async (updatedBoards) => {
    if (!isAuthenticated || !user || !token) return;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Send updated boards to backend
      await axios.put('/api/boards', { boards: updatedBoards }, config);
    } catch (err) {
      console.error('Error saving boards:', err);
      setError('Failed to save your changes. Please try again.');
    }
  };

  const addboardHandler = async (name) => {
    const tempBoards = [...boards];
    const newBoard = {
      id: Date.now() + Math.random() * 2,
      title: name,
      cards: [],
    };
    tempBoards.push(newBoard);
    setBoards(tempBoards);
    
    try {
      // Save new board to the backend
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      await axios.post('/api/boards', { board: newBoard }, config);
    } catch (err) {
      console.error('Error adding board:', err);
      // setError('Failed to add board. Please try again.');
    }
  };

  const removeBoard = async (id) => {
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    tempBoards.splice(index, 1);
    setBoards(tempBoards);
    
    try {
      // Delete board from backend
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      await axios.delete(`/api/boards/${id}`, config);
    } catch (err) {
      console.error('Error removing board:', err);
      // setError('Failed to remove board. Please try again.');
    }
  };

 
  const addCardHandler = async (id, title) => {
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    const newCard = {
      id: Date.now() + Math.random() * 2,
      title,
      labels: [],
      date: "",
      tasks: [],
    };
    
    tempBoards[index].cards.push(newCard);
    setBoards(tempBoards);
    
    try {
      // Add card to board in backend
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      await axios.post(`/api/boards/${id}/cards`, { card: newCard }, config);
    } catch (err) {
      console.error('Error adding card:', err);
      // setError('Failed to add card. Please try again.');
    }
  };

  const removeCard = async (bid, cid) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    cards.splice(cardIndex, 1);
    setBoards(tempBoards);
    
    try {
      // Remove card from backend
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      await axios.delete(`/api/boards/${bid}/cards/${cid}`, config);
    } catch (err) {
      console.error('Error removing card:', err);
      // setError('Failed to remove card. Please try again.');
    }
  };

  const dragEnded = async (bid, cid) => {
    const s_boardIndex = boards.findIndex((item) => item.id === bid);
    if (s_boardIndex < 0) return;
  
    const s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
      (item) => item.id === cid
    );
    if (s_cardIndex < 0) return;
  
    const t_boardIndex = boards.findIndex((item) => item.id === targetCard.bid);
    if (t_boardIndex < 0) return;
  
    const t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
      (item) => item.id === targetCard.cid
    );
    if (t_cardIndex < 0) return;
  
    const tempBoards = [...boards];
    const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
    setBoards(tempBoards);
  
    setTargetCard({
      bid: "",
      cid: "",
    });
  
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
  
      await axios.put(
        '/api/boards/drag',
        {
          sourceBoard: bid,
          targetBoard: targetCard.bid,
          cardId: cid,
          newPosition: t_cardIndex,
        },
        config
      );
    } catch (err) {
      console.error('Error updating card position:', err.response?.data || err.message);
      setError('Failed to update card position. Please try again.');
    }
  };

  const dragEntered = (bid, cid) => {
    if (targetCard.cid === cid) return;
    setTargetCard({
      bid,
      cid,
    });
  };

  const updateCard = async (bid, cid, card) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].cards[cardIndex] = card;
    setBoards(tempBoards);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(
        '/api/boards/drag',
        {
          sourceBoard: bid,
          targetBoard: targetCard.bid,
          cardId: cid,
          newPosition: t_cardIndex,
        },
        config
      );
    } catch (err) {
      console.error('Error updating card position:', err.response?.data || err.message);
      // setError('Failed to update card position. Please try again.');
    }
  };

  // Show loading indicator
  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="ml-14 md:ml-56 flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700">Loading your boards...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no user is logged in, show login message
  if (!isAuthenticated || !user) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="ml-14 md:ml-56 flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-gray-800 mb-4">Please Log In</h1>
              <p className="text-gray-600">You need to log in to view and manage your tasks</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="ml-14 md:ml-56 flex-1 p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Task Management</h1>
          <p className="text-gray-600 mb-6">
            Welcome {user.name || user.email}! 
            {user.role && <span> ({user.role})</span>} Organize your tasks with our Kanban board
          </p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}
          
          <div className="w-full h-full overflow-x-auto pt-5">
            <div className="h-full w-fit flex gap-8">
              {boards.map((item) => (
                <Board
                  key={item.id}
                  board={item}
                  addCard={addCardHandler}
                  removeBoard={() => removeBoard(item.id)}
                  removeCard={removeCard}
                  dragEnded={dragEnded}
                  dragEntered={dragEntered}
                  updateCard={updateCard}
                />
              ))}
              <div className="flex-basis-[290px] min-w-[290px]">
                <Editable
                  displayClass="bg-white text-black rounded-lg shadow w-full text-center"
                  editClass="bg-white rounded-lg p-2"
                  placeholder="Enter Board Name"
                  text="Add Board"
                  buttonText="Add Board"
                  onSubmit={addboardHandler}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TasksPage;