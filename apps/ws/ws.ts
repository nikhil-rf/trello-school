import { WebSocket, WebSocketServer } from "ws";

interface ISSUE {id: number, title: string, section: string}
let ISSUE: ISSUE[] = [{
    id: 1,
    title: "fix bg color",
    section: "todo"
},{
    id: 2,
    title: "fix bg color",
    section: "done"
}]


const wss = new WebSocketServer({port: 3000});
const connections = [];

wss.on('connection', (socket) => {
    connections.push(socket);
  console.log('someone connected!');
  socket.send{JSON.stringify({
    type: "initial_state",
    issue: ISSUE 
  })}

  socket.on("data", (data) => {
    const parsedData = JSON.parse(data.toString());
    if(parsedData.type === "issue_added"){
        const newIssue = {
            title: parsedData.title,
            section: parsedData.section,
            id: Math.random()
        }
        ISSUE.push(newIssue)
        connections.forEach(s => s.send(JSON.stringify({
            type: "issue_added",
            issue: newIssue
        })))
    }

    if(parsedData.type === "delete_issue"){
        ISSUE = ISSUE.filter(x => x.id != parsedData.issueId)
        connections.forEach(s => s.send(JSON.stringify({
            type: "delete_issue",
            issueId: parsedData.issueId
        })))
    }

  })
});

