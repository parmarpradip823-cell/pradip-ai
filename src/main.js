import './style.css'

document.querySelector('#app').innerHTML = `
<div class="container">
  <div class="header">🤖 Pradip AI</div>

  <div id="chat" class="chat">
    <div class="ai">
      🙏 Jai Shree Ram! Main Pradip AI hoon.<br>
      Main aapki kis tarah madad kar sakta hoon?
    </div>
  </div>

  <div class="bottom">
    <input id="message" placeholder="Apna question likhiye..." />
    <button id="send">Send</button>
  </div>
</div>
`

const chat = document.getElementById("chat")
const input = document.getElementById("message")
const sendBtn = document.getElementById("send")

function addMessage(text, type) {
  const div = document.createElement("div")
  div.className = type
  div.innerText = text
  chat.appendChild(div)
  chat.scrollTop = chat.scrollHeight
  return div
}

async function sendMessage() {
  const message = input.value.trim()
  if (!message) return

  addMessage(message, "user")
  input.value = ""

  const thinking = addMessage("Thinking...", "ai")

  try {
    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    })

    const data = await res.json()
    thinking.remove()
    addMessage(data.reply, "ai")
  } catch (error) {
    thinking.remove()
    addMessage("Connection error. Backend server check karo.", "ai")
  }
}

sendBtn.addEventListener("click", sendMessage)

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage()
  }
})