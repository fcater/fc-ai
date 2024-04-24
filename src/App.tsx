import { useState } from "react";
import "./App.css";
import AI_Logo from "./assets/ai.svg";
import User_Logo from "./assets/user.svg";
import AI_Keys from "./constants/AIKeys";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function App() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const ask = async (content: string) => {
    const _messages = messages.concat({ role: "user", content });

    setText("");
    setMessages(_messages);
    try {
      const res = await fetch(AI_Keys.test.url, {
        method: "POST",
        body: JSON.stringify({ model: AI_Keys.test.model, messages: _messages }),
        headers: { Authorization: `Bearer ${AI_Keys.test.key}`, "Content-Type": "application/json" },
      });

      const data = await res.json();
      setMessages(_messages.concat(data.choices[0].message));
    } catch (error) {
      setMessages(messages);
      setText(text);
    }
  };
  return (
    <div className="content">
      {messages.length === 0 && (
        <div className="AIPlaceholder" v-if="messages.length === 0">
          <img src={AI_Logo} className="logo" alt="logo" />
          <p> 今天来点什么？ </p>
          <p> How Can I help you? </p>
        </div>
      )}
      <div className="text-area">
        {messages.map((message) => (
          <div className="messageGroup">
            <img src={message.role === "assistant" ? AI_Logo : User_Logo} className="avatar" alt="logo" />
            <p className="message">{message.content}</p>
          </div>
        ))}
      </div>
      <div className="inputGroup">
        <input
          value={text}
          id="askInput"
          onChange={(e) => setText(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") ask(text);
          }}
        />
        <label className="speech" htmlFor="askInput" onClick={() => ask(text)}>
          📣
        </label>
      </div>
    </div>
  );
}

export default App;
