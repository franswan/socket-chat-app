import io from "socket.io-client";
import { useState, useEffect } from "react";

let socket;

type Message = {
  author: string;
  message: string;
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io();

    socket.on("newIncomingMessage", (msg) => {
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: msg.author, message: msg.message },
      ]);
      console.log(messages);
    });
  };

  const sendMessage = async () => {
    socket.emit("createdMessage", { author: chosenUsername, message });
    setMessages((currentMsg) => [
      ...currentMsg,
      { author: chosenUsername, message },
    ]);
    setMessage("");
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      if (message) {
        sendMessage();
      }
    }
  };

  return (
    <div className="font-jetbrains flex items-center p-4 mx-auto min-h-screen justify-center bg-purple-500">
      
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-sm">Boring Trollbox</h1>
        {!chosenUsername ? (
          <>
            <h3 className="text-xs">
              Who are you?
            </h3>
            <form>
            <input
              type="text"
              placeholder="anon..."
              value={username}
              className="bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white  border border-gray rounded-sm p-2 focus-within:border-blue focus-within:ring-1 focus-within:ring-blue text-xs"
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="mt-2">
            <button
              onClick={() => {
                setChosenUsername(username);
              }}
              className="float-right mb-2 inline-flex items-center rounded-sm border border-gray dark:border-black text-xs bg-white px-3 py-2 text-boring-black hover:bg-boring-white hover:opacity-70 active:opacity-50 shadow-md active:shadow-sm"
            >
              Go!
            </button>
            </div>
            </form>
          </>
        ) : (
          <>
            <p className="font-bold text-white text-xl">
              Your username: {username}
            </p>
            <div className="flex flex-col justify-end bg-white h-[20rem] min-w-[33%] rounded-md shadow-md ">
              <div className="h-full last:border-b-0 overflow-y-scroll">
                {messages.map((msg, i) => {
                  return (
                    <div
                      className="w-full py-1 px-2 border-b border-gray-lightest text-xs"
                      key={i}
                    >
                      {msg.author} : {msg.message}
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-lightest w-full flex rounded-bl-md">
                <input
                  type="text"
                  placeholder="New message..."
                  value={message}
                  className="outline-none py-2 px-2 rounded-bl-md flex-1 text-xs"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyUp={handleKeypress}
                />
                <div className="border-l border-gray-lightest flex justify-center items-center  rounded-br-md group hover:bg-purple-500 transition-all">
                  <button
                    className="group-hover:text-gray text-xs px-3 h-full"
                    onClick={() => {
                      sendMessage();
                    }}
                  >
                    troll
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
