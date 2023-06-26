// const socket = io()
// const div = document.querySelector('.b .box')
// socket.on('joinGame', (data) => {
//     let clone = div.cloneNode(true)
//     console.log(data);
//     document.body.innerHTML = ''
//     for (let key in data) {
//         console.log(key);
//         console.log(clone);
//         document.body.innerHTML += `
//             <div class="box"></div>
//         `
//     }
// })


const socket = io();
const div = document.querySelector('.b .box');
const input = document.querySelector('.int')
const btn = document.querySelector('.btn')
socket.on('newUser', (user) => {
    // document.querySelector('.text').innerHTML = ``
    document.querySelector('.text').innerHTML += `<div class="${user} box"></div>`
});

socket.on('AllUser', (users) => {
    for (let user in users) {
        document.querySelector('.text').innerHTML += `<div class="${user} box"></div>`
    }
})

// btn.onclick = () => {
//     console.log(input.value);
//     socket.emit('message', input.value)
// }

// socket.on('sendMessage', (msg) => {
//     document.querySelector('.text').innerText += msg + '\n'
// })