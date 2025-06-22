import React, { useEffect, useState, useRef } from "react";
import {
  getFriendList,
  getSHowMessagesService,
} from "../../../services/chat-service";
import { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { Client, Frame, IMessage } from "@stomp/stompjs";
import moment from "moment";

interface Chat {
  id: number;
  message: string;
  sender: "me" | "friend";
  time: string;
}

interface Friend {
  id: number;
  name: string;
  chats: Chat[];
}

const Chat: React.FC = () => {
  const id = useSelector((state: RootState) => state?.user?.userData?.id);
  const email = useSelector((state: RootState) => state?.user?.userData?.email);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [friendsList, setFriendList] = useState<any[]>([]);
  const [chatArray, setChatArray] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [emailSelected, setemailSelected] = useState<string>("");
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const serverUrl = "https://devfoknje7ik.com:8081/ws";

  useEffect(() => {
    getFriendList()
      .then((res) => {
        setFriendList(res.data);
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });

    const socket = new SockJS(serverUrl);
    const stomp = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      },
      onConnect: (frame: Frame) => {
        console.log("Connected: " + frame);
        console.log(`/topic/${email}/${emailSelected}`);

        stomp.subscribe(
          `/topic/${email}/${emailSelected}`,
          (messageOutput: IMessage) => {
            console.log("Message received from server:", messageOutput.body);
            const parsedMessage = JSON.parse(messageOutput.body);
            if (parsedMessage && parsedMessage.content) {
              setChatArray((prevMessages) => [...prevMessages, parsedMessage]);
            } else {
              console.error(
                "Received an empty or malformed message:",
                parsedMessage,
              );
            }
          },
        );
        stomp.subscribe(
          `/topic/${emailSelected}/${email}`,
          (messageOutput: IMessage) => {
            console.log("Message received from server:", messageOutput.body);
            const parsedMessage = JSON.parse(messageOutput.body);
            if (parsedMessage && parsedMessage.content) {
              setChatArray((prevMessages) => [...prevMessages, parsedMessage]);
            } else {
              console.error(
                "Received an empty or malformed message:",
                parsedMessage,
              );
            }
          },
        );
      },
      onStompError: (frame: Frame) => {
        console.error("Broker error: " + frame.headers["message"]);
        console.error("Details: " + frame.body);
      },
    });

    stomp.activate();
    setStompClient(stomp);

    return () => {
      if (stomp) {
        stomp.deactivate();
      }
    };
  }, [email, emailSelected]);

  const showMessage = (message: { sender: string; content: string }) => {
    console.log("showMessage called", message);
    setChatArray((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        message: message.content,
        sender: message.sender,
        time: new Date().toLocaleTimeString(),
      },
    ]);
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const sendMessage = () => {
    if (message.trim() && stompClient && selectedFriend) {
      const messageObject = {
        sender: email,
        receiver: emailSelected,
        content: message,
        timestamp: moment().format("YYYY-MM-DDTHH:mm:ss.SSSSS"),
      };
      stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(messageObject),
      });
      setMessage("");
    } else {
      console.error(
        "Attempted to send an empty message or no selected friend.",
      );
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatArray]);

  const handleSelectFriend = (friend: any) => {
    setemailSelected(friend.email);
    setMessage("");
    getSHowMessagesService(friend.id)
      .then((res) => {
        setChatArray(res);
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      })
      .catch((e) => {
        console.log(e);
      });
    setSelectedFriend(friend);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col items-center  md:items-start  lg:flex-row h-full py-3 lg:py-0  lg:h-screen bg-gray-100">
      <div className="md:w-[400px] w-[320px] bg-white shadow-md pl-2 pr-1 h-[70vh]">
        <h2 className=" text-2xl font-bold mb-4 text-center text-title">
          Condidat
        </h2>
        <ul className="space-y-2 overflow-y-scroll h-[60vh] md:h-[60vh] overflow-hidden px-2">
          {friendsList.map((friend) => (
            <li
              key={friend.user.id}
              onClick={() => handleSelectFriend(friend.user)}
              className={`px-2 py-2 cursor-pointer mb-2 rounded-xl flex justify-between items-start  overflow-hidden ${
                selectedFriend && selectedFriend.id === friend.id
                  ? "bg-chatReceiver_bg"
                  : "bg-chatSender_bg"
              }`}
            >
              <div className="w-full">
                <div className="text-lg font-semibold text-gray-800">
                  {friend.user.fullName}
                </div>
                <div className="text-sm text-gray-600 truncate ">
                  {friend?.lastChat?.content ?? "pas de message"}
                </div>
                <div className="text-xs text-gray-500  text-right ">
                  {friend?.lastChat?.timestamp
                    ? new Date(friend.lastChat.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
              </div>
              </div>
              
            </li>
          ))}
        </ul>
      </div>

      {selectedFriend ? (
        <div className="mt-5 lg:mt-0 h-[80vh] md:h-[60vh] lg:w-3/4 lg:p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Chat with {selectedFriend.fullName}
          </h2>
          <div className="flex flex-col bg-white shadow-md rounded-lg justify-between">
            <div
              className="flex flex-col overflow-y-scroll mb-4 p-4 h-[50vh]"
              ref={chatBoxRef}
            >
              {chatArray?.map((chat) => (
                <div
                  key={chat.timestamp}
                  className={`flex flex-col max-w-3${
                    chat.sender === email ? "self-end" : "self-start"
                  }`}
                >
                  {chat.sender !== email && (
                    <div className="font-montserrat_regular text-primary text-xs mb-2">
                      {selectedFriend.fullName}
                    </div>
                  )}
                  <div
                    className={`mb-1 px-2 py-1 font-montserrat_regular h-auto rounded max-w-xl text-title rounded-t-xl break-words ${
                      chat.sender === email
                        ? "bg-chatSender_bg self-end rounded-bl-xl"
                        : "bg-chatReceiver_bg self-start rounded-br-xl"
                    }`}
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {chat.content}
                  </div>
                  <div
                    className={`font-normal text-gray-500 text-xs ${
                      chat.sender === email ? "self-end" : "self-start"
                    }`}
                  >
                    {new Date(chat.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                className="flex-grow p-3 border rounded-l-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 "
                placeholder="Ecrire un message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="bg-text text-white px-4 py-3 rounded-r-lg transition duration-300 hover:bg-blue-700"
                onClick={sendMessage}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center text-gray-500">
          <span className="text-lg">Selectionner un condidat</span>
        </div>
      )}
    </div>
  );
};

export default Chat;
