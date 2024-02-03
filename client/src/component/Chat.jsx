import React, { useState, useEffect, useRef, useContext } from 'react'
import NavBar from './NavBar'
import { UserContext } from "../context/UserContext"
import axios from 'axios'
import Logo from './Logo'
import Contect from './Contect'
import { uniqBy } from 'lodash';

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [message, setMessage] = useState([]);
  const { username, id, setUsername, setId } = useContext(UserContext);
  const [newMessageText, setNewMessageText] = useState("");

  const logout = () => {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  };

  useEffect(() => {
    connectToWs();
  }, [setSelectedUserId])

  const connectToWs = () => {
    const ws = new WebSocket('ws://localhost:4000')
    setWs(ws);
    ws.addEventListener('message', handleMessage)
    ws.addEventListener('close', () => {
      setTimeout(() => {
        console.log("Disconnected. Trying to reconnect.");
        connectToWs();
      }, 1000);
    })
  }

  //handleMessage เช็คว่าแค่ online หรือ  Chat กัน
  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    //กรณีที่ online
    if ('online' in messageData) {
      showOnlinePeople(messageData.online)
    }
    //กรณีที่ Chat
    else if ('text' in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessage((prev) => [...prev, { ...messageData }])
      }
    }
  }

  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      if (userId !== id) {
        people[userId] = username;
      }
    });
    setOnlinePeople(people);
  };

  //เมื่อ setOnlinePeople เปลี่ยน useEffect นี้จะทำงาน
  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople, id]);

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[id];

  const sendMessage = (e, file = null) => {
    if (e) e.preventDefault();
    ws.send(JSON.stringify({
      recipient: selectedUserId,
      text: newMessageText,
      file,
    }));
    if (file) {
      axios.get("/message/" + selectedUserId).then((res) => {
        setMessage(res.data);
      });
    } else {
      setNewMessageText("");
      setMessage((prev) => [
        ...prev,
        {
          text: newMessageText,
          sender: id,
          recipient: selectedUserId,
          _id: Date.now(),
        },
      ]);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/message/" + selectedUserId).then((res) => {
        setMessage(res.data);
      });
    }
  }, [selectedUserId]);

  const messageWithoutDups = uniqBy(message, "_id")

  const sendFile = (e) => {
    const reader = new FileReader
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      sendMessage(null, { name: e.target.files[0].name, data: reader.result })
    }
  }
  return (
    <>

      <div className='flex h-screen'>
        <div className='w-1/3 flex flex-col bg-[#171618]'>
          <div className='flex-grow '>
            <Logo />
            {Object.keys(onlinePeopleExclOurUser).map((userId) => (
              <Contect
                key={userId}
                username={onlinePeople[userId]}
                id={userId}
                online={true}
                selected={userId === selectedUserId}
                onClick={() => setSelectedUserId(userId)}
              />
            ))}

            {Object.keys(offlinePeople).map((userId) => (
              <Contect
                key={userId}
                username={offlinePeople[userId].username}
                id={userId}
                online={false}
                selected={userId === selectedUserId}
                onClick={() => setSelectedUserId(userId)}
              />
            ))}
          </div>
          <div className='p-2 text-center flex items-center justify-center'>
            <span className='mr-2 text-sm text-white flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-1 w-6 h-6">
                <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
              </svg>
              {username}
            </span>
            <button className='text-sm text-white ml-3 py-1 px-2 border rounded-md text-center' onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div className='w-2/3 flex flex-col p-4'>
          <div className='flex-grow'>
            {!selectedUserId && (
              <div className='flex  h-full flex-grow items-center justify-center'>
                <div className='text-white'>
                  &larr; Seleact a person from sideber
                </div>
              </div>
            )}



            {!!selectedUserId && (
              <div className='relative h-full'>
                <div className='overflow-y-scroll absolute top-0 left-0 right-0 bottom-2'>
                  {messageWithoutDups.map((message) => (
                    <div key={message._id} className={(message.sender === id ? "text-right" : "text-left")}>
                      <div className={'chat chat-start text-left inline-block p-2 my-2 rounded-md text-lg ' +
                        (message.sender === id ?
                          "bg-[#f0f0f0] text-black" :
                          "bg-[#573110] text-white")}>
                        {message.text}
                        {message.file && (
                          <div className=''>
                            <a target='_blank' href={axios.defaults.baseURL + "/uploads/" + message.file} className="flex items-center gap-1 border-b">
                              {message.file}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <form className='flex gap-2 mx-3' onSubmit={sendMessage}>
            <input
              className='flex-grow border border-[#3d4451] rounded-lg p-2'
              type='text'
              value={newMessageText}
              onChange={e => setNewMessageText(e.target.value)}
              placeholder='Type your message'
            />
            <label className='bg-[#573110] p-2 text-white cursor-pointer rounded-lg '>
              <input type="file" className='hidden' onChange={sendFile} />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M19.906 9c.382 0 .749.057 1.094.162V9a3 3 0 0 0-3-3h-3.879a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H6a3 3 0 0 0-3 3v3.162A3.756 3.756 0 0 1 4.094 9h15.812ZM4.094 10.5a2.25 2.25 0 0 0-2.227 2.568l.857 6A2.25 2.25 0 0 0 4.951 21H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-2.227-2.568H4.094Z" />
              </svg>
            </label>
            <button className='bg-[#ffaa00] p-2 text-white cursor-pointer rounded-lg' type='submit'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className=" w-6 h-6">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Chat