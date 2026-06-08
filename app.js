const SYSTEM_PROMPT = `Aap ek expert AI phone technician hain. Aapka naam "PhixBot" hai. Aap users ke phone problems diagnose karte hain aur step-by-step repair solutions dete hain. Hinglish mein baat karo. Friendly raho.`;

function App() {
  const [messages, setMessages] = React.useState([{role:"assistant",content:"Namaste! 👋 Main PhixBot hoon — aapka AI Phone Technician! Phone ki koi bhi problem batao! 🔧"}]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMsgs = [...messages, {role:"user",content:userMsg}];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYSTEM_PROMPT,messages:newMsgs})
      });
      const data = await res.json();
      const reply = data.content?.map(c=>c.text||"").join("") || "Error aaya, dobara try karo.";
      setMessages(m=>[...m,{role:"assistant",content:reply}]);
    } catch(e) {
      setMessages(m=>[...m,{role:"assistant",content:"Network error. Please try again."}]);
    }
    setLoading(false);
  };

  return React.createElement("div", {style:{fontFamily:"sans-serif",maxWidth:"600px",margin:"0 auto",padding:"20px",background:"#0a0a0f",minHeight:"100vh",color:"#d0f0d0"}},
    React.createElement("h2", {style:{color:"#00ff9f",textAlign:"center"}}, "🤖 PhixBot - AI Phone Repair"),
    React.createElement("div", {style:{height:"60vh",overflowY:"auto",border:"1px solid #00ff9f33",borderRadius:"12px",padding:"12px",marginBottom:"12px"}},
      messages.map((m,i)=>React.createElement("div",{key:i,style:{textAlign:m.role==="user"?"right":"left",margin:"8px 0"}},
        React.createElement("span",{style:{background:m.role==="user"?"#001f3f":"#0d1f0d",border:`1px solid ${m.role==="user"?"#00d4ff44":"#00ff9f33"}`,borderRadius:"12px",padding:"10px 14px",display:"inline-block",maxWidth:"80%",whiteSpace:"pre-wrap"}}, m.content)
      )),
      loading && React.createElement("div",{style:{color:"#00ff9f88"}},"⏳ Analyzing...")
    ),
    React.createElement("div",{style:{display:"flex",gap:"8px"}},
      React.createElement("input",{value:input,onChange:e=>setInput(e.target.value),onKeyDown:e=>e.key==="Enter"&&send(),placeholder:"Phone ki problem likho...",style:{flex:1,padding:"12px",borderRadius:"10px",border:"1px solid #00ff9f33",background:"#0d1f0d",color:"#d0f0d0",fontSize:"14px"}}),
      React.createElement("button",{onClick:send,disabled:loading,style:{background:"#00ff9f",border:"none",borderRadius:"10px",padding:"12px 18px",fontWeight:"bold",cursor:"pointer"}}, "➤")
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
