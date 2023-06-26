const socket = io();
let IsCreate = false;
const join_btn = document.getElementById('join_btn');
const create_btn = document.getElementById('create_btn');
const room_name_int = document.getElementById('room_name_int');
const room_name_int2 = document.getElementById('room_name_int2');

join_btn.onclick = () => {
    if (IsCreate) {
        document.querySelector('.join').classList.remove('active');
        document.querySelector('.create').classList.remove('active');
        IsCreate = false;
    } else {
        if (room_name_int.value.length > 0) {
            socket.emit('joinRoom', room_name_int.value);
        }
    }
};

create_btn.onclick = () => {
    if (!IsCreate) {
        document.querySelector('.join').classList.add('active');
        document.querySelector('.create').classList.add('active');
        IsCreate = true;
    } else {
        if (room_name_int2.value.length > 0) {
            socket.emit('createRoom', room_name_int2.value);
        }
    }
};

socket.on('errRoom', (roomName) => {
    console.log(`Bunday xona topilmadi: ${roomName}`);
});

// ========== Game modes
const step_one = document.querySelector('.step_one');
const step_two = document.querySelector('.step_two');
const text = document.querySelector('.Text');
const road = document.querySelector('.road');
const race_area = document.querySelector('.race_area');
const car = document.querySelector('.car');

socket.on('OpenGameData', (data) => {
    text.innerText = data.talk;
    step_one.classList.add('hidden');
    step_two.classList.remove('hidden');
});

// ==== Text And Car =====
let race_start = false;
let Players = {};

socket.on('JoinGame', (data) => {
    console.log(data.users);
    let clone = road.cloneNode(true);
    for (let key in data.users) {
        console.log(key);
        Players[key] = clone;
        race_area.appendChild(Players[key]);
    }
    text.innerText = data.talk;
    document.querySelector('.start_race_btn').style.display = 'none';
    step_one.classList.add('hidden');
    step_two.classList.remove('hidden');
});

document.querySelector('.start_race_btn').onclick = () => {
    document.querySelector('.start_race_bg').style.display = 'none';
    race_start = true;
};

let i = 0;
let CarMove = (road.offsetWidth - car.offsetWidth) / text.innerText.length;

document.addEventListener('keydown', (e) => {
    if (text.innerText[i] == e.key && race_start) {
        text.innerHTML = `<span class='text green'>${text.innerText.slice(
            0,
            i + 1
        )}</span>${text.innerText.slice(i + 1, text.innerText.length)}`;
        i++;
        console.log(CarMove);
        CarMove += (road.offsetWidth - car.offsetWidth) / text.innerText.length;
        car.style.transform = `translate(${CarMove}px,-8px) `;
    }
});

// ==== Text =====
// ========== Game modes
