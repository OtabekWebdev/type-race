const socket = io()
let IsCreate = false;
let AdminStart = false
let id;
let CarMove;
let CarFullLength;
let User;
let UserName = localStorage.getItem('UserName');
console.log(UserName);
let UsersTag = {}
const join_btn = document.getElementById('join_btn');
const create_btn = document.getElementById('create_btn');
const room_name_int = document.getElementById('room_name_int');
const room_name_int2 = document.getElementById('room_name_int2');
const step_one = document.querySelector('.step_one');
const step_two = document.querySelector('.step_two');
const text = document.querySelector('.Text');

if (UserName) {
    document.querySelector('.auth').classList.add('hidden');
    step_one.classList.remove('hidden');
} else {
    document.querySelector('.name_btn').onclick = () => {
        if (document.querySelector('.name_int').value.length > 3) {
            UserName = document.querySelector('.name_int').value
            localStorage.setItem('UserName', UserName)
            document.querySelector('.auth').classList.add('hidden');
            step_one.classList.remove('hidden');
        } else {
            alert('Kamida 3ta belgi')
        }
    }
}

join_btn.onclick = () => {
    if (IsCreate) {
        document.querySelector('.join').classList.remove('active');
        document.querySelector('.create').classList.remove('active');
        IsCreate = false;
    } else {
        if (room_name_int.value.length > 0) {
            socket.emit('joinRoom', { name: UserName, roomName: room_name_int.value });
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
            socket.emit('createRoom', { name: UserName, roomName: room_name_int2.value });
        }
    }
};

socket.on('errRoom', (roomName) => {
    console.log(`Bunday xona topilmadi: ${roomName}`);
});

// ========== Game modes
// const player_road = (name) => `<div
// class="road ${name} mb-2"
// style="background: url('./img/road.png') center center / cover"
// >
// <img
//   class="car -translate-y-2 translate-x-0 duration-100"
//   src="./img/car.png"
//   width="150px"
//   alt=""
// />
// </div>`
const player_road = document.querySelector('.hide .road')
const race_area = document.querySelector('.race_area');
// const car = document.querySelector('.car');

socket.on('RoomData', (data) => {
    text.innerText = data.talk
    id = data.admin
    let clone = player_road.cloneNode(true);
    clone.classList.add(id)
    UsersTag[id] = clone.querySelector('.car')
    race_area.appendChild(clone);
    step_one.classList.add('hidden')
    step_two.classList.remove('hidden')
})

socket.on('newUser', (data) => {
    if (data.id != id) {
        let clone = player_road.cloneNode(true);
        clone.classList.add(data.id)
        UsersTag[data.id] = clone.querySelector('.car')
        clone.querySelector('.mark').innerText = data.name
        race_area.appendChild(clone);
    }
    console.log('Add');
})

socket.on('leaveUser', (userId) => {
    race_area.removeChild(document.querySelector(`.${userId}`))
})

socket.on('allUser', (data) => {
    console.log('Add');
    id = data.id
    document.querySelector('.start_race_btn').classList.add('hidden')
    step_one.classList.add('hidden')
    step_two.classList.remove('hidden')
    text.innerText = data.talk
    console.log(data);
    for (let user in data.Users) {
        let clone = player_road.cloneNode(true);
        clone.classList.add(user)
        clone.querySelector('.mark').innerText = data.Users[user].name
        if (user == id) {
            clone.querySelector('.mark').innerText = 'You'
        }
        UsersTag[user] = clone.querySelector('.car')
        race_area.appendChild(clone)
        // console.log(race_area.innerHTML);
        // debugger
    }
})

let lights = document.querySelector('.lights')
document.querySelector('.start_race_btn').onclick = () => {
    document.querySelector('.start_race_btn').classList.add('hidden')
    lights.classList.remove('hidden')
    lights.classList.add('flex')
    let colors = ['green', 'yellow', 'red']
    let l = 0
    socket.emit('startGame', true)
    let timer = setInterval(() => {
        lights.querySelectorAll('.light')[l].style.backgroundColor = colors[l]
        if (l == 2) {
            clearInterval(timer)
            setTimeout(() => {
                document.querySelector('.start_race_bg').classList.add('hidden')
            }, 500);
        }
        l++
    }, 1000);
}

socket.on('startRace', (data) => {
    lights.classList.remove('hidden')
    lights.classList.add('flex')
    let colors = ['green', 'yellow', 'red']
    let l = 0
    let timer = setInterval(() => {
        lights.querySelectorAll('.light')[l].style.backgroundColor = colors[l]
        if (l == 2) {
            clearInterval(timer)
            setTimeout(() => {
                document.querySelector('.start_race_bg').classList.add('hidden')
                AdminStart = true
            }, 500);
        }
        l++
    }, 1000);
    CarMove = (document.querySelector(`.container .road`).offsetWidth - 150) / text.innerText.length;
    CarFullLength = CarMove
})

let i = 0;

document.addEventListener('keyup', (e) => {
    if (text.innerText[i] == e.key && AdminStart) {
        text.innerHTML = `<span class='text green'>${text.innerText.slice(0, i + 1)}</span>${text.innerText.slice(i + 1, text.innerText.length)}`;
        i++;
        UsersTag[id].style.transform = `translate(${CarMove}px, -8px)`;
        CarMove += (document.querySelector(`.container .road`).offsetWidth - 150) / text.innerText.length;
        socket.emit('moveUser', { id, i })
        if (CarMove == document.querySelector(`.container .road`).offsetWidth - 150) {
            alert('You Win')
        }
    }
});

socket.on('MoveUser', (data) => {
    UsersTag[data.id].style.transform = `translate(${CarFullLength * data.i}px, -8px)`;
    if (CarFullLength * data.i == document.querySelector(`.container .road`).offsetWidth - 150) {
        alert(`${data.name} win!`)
    }
})

// console.log(road);
// let clone = road.cloneNode(true);
// // let
// socket.on('newUser', (data) => {
//     step_one.classList.add('hidden');
//     step_two.classList.remove('hidden');
//     console.log(data);
//     for (let key in data.users) {
//         (() => {
//             race_area.appendChild(clone);
//             console.log('clone', race_area);
//         })()
//     }
// })
