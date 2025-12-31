console.log("来~让我康康");

function warning_continue() { //警告弹窗下的"继续"按钮
    console.log("登dua~郎")
    var element = document.getElementById("warning");
    element.style.display = 'none';
}

function warning_exit() { //警告弹窗下的"关闭"按钮(可能无效)
    window.opener = null;
    window.open('', '_self').close();
}


const URL = "https://broadcast-legislation-marilyn-wood.trycloudflare.com"
const DELAY = 60; //刷新间隔

var name;
//获取用户列表
function fetchUserList() {
    return fetch(URL + "/get_user")
        .then(res => res.json())
        .catch(err => {
            console.error("获取用户列表失败：", err);
            return []; // 返回空数组避免程序崩溃
        });
}
async function setName() {
    let userList = await fetchUserList(); // 等待用户列表加载

    while (true) {
        name = prompt("请输入你的昵称：");
        if (!name) continue;

        if (userList.includes(name)) {
            alert("此昵称已被别人占用,请更改它。");
        } else {
            break;
        }
    }
}

setName();
console.log(name)

//页面加载完成后立即获取历史记录
document.addEventListener("DOMContentLoaded", () => {
    fetchChatHistory();
});
// 自动滚动到底部函数
function scrollToBottom() {
    const chatContainer = document.getElementById('chatHistory');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
//刷新
setInterval(() => {
    fetchChatHistory();
}, DELAY);
//获取并显示消息 对应Java @GetMapping
function fetchChatHistory() {
    fetch(URL + "/get_msg")
        .then(response => response.json())
        .then(data => {
            const chatContainer = document.getElementById('chatHistory');
            chatContainer.innerHTML = '';

            data.forEach(msg => {
                const msgDiv = document.createElement('div');
                msgDiv.innerText = msg.text; // Java类中的text字段

                //判断是谁发的 (对应Java类中的user字段)
                if (msg.user == name) {
                    msgDiv.className = 'message me';
                } else {
                    msgDiv.className = 'message other';
                }
                chatContainer.appendChild(msgDiv);
            });
            //scrollToBottom();
        })
        .catch(error => {
            console.error('获取聊天记录失败:', error);
            const chatContainer = document.getElementById('chatHistory');
            chatContainer.innerHTML = '<div style="text-align:center">获取失败，请刷新重试</div>';
        });;
}

//发送消息逻辑 对应Java的@PostMapping
document.getElementById('sendButton').onclick = function() {
    const input = document.getElementById('msgInput');
    const text = input.value;
    if (!text) return;

    // 发送 POST 请求给 Spring Boot
    fetch(URL + "/set_msg", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                user: name
            }) // 发送 JSON 数据
        })
        .then(() => {
            input.value = ''; // 清空输入框
            fetchChatHistory(); // 重新拉取最新记录
        });
    scrollToBottom();
};