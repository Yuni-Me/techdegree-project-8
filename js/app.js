//===============================================
//              Variables
//===============================================
let employees = [];
const urlAPI = 'https://randomuser.me/api/?results=12&inc=name, picture, email, location, phone, dob &noinfo &nat=us';
const container = document.querySelector('.grid-container');
const overlay = document.querySelector('.overlay');
const modalContent = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
const statesUS = [
    {Alabama: 'AL'}, {Alaska: 'AK'}, {Arizona: 'AZ'}, {Arkansas:'AR'}, {California:'CA'}, {Colorado:'CO'}, {Connecticut:'CT'}, {Delaware:'DE'}, {Florida:'FL'}, {Georgia:'GA'},
    {Hawaii:'HI'}, {Idaho:'ID'}, {Illinois:'IL'}, {Indiana:'IN'}, {Iowa:'IA'}, {Kansas:'KS'}, {Kentucky:'KY'}, {Louisiana:'LA'}, {Maine:'ME'}, {Maryland:'MD'}, {Massachusetts:'MA'}, {Michigan:'MI'}, {Minnesota:'MN'}, {Mississippi:'MS'}, {Missouri:'MO'}, {Montana:'MT'}, {Nebraska:'NE'}, {Nevada:'NV'}, 
    {"New Hampshire":'NH'}, {"New Jersey":'NJ'}, {"New Mexico":'NM'}, {"New York":'NY'}, {"North Carolina":'NC'}, {"North Dakota":'ND'}, {Ohio:'OH'}, {Oklahoma:'OK'}, {Oregon:'OR'}, {Pennsylvania:'PA'}, {"Rhode Island":'RI'}, {"South Carolina":'SC'}, {"South Dakota":'SD'}, {Tennessee:'TN'}, {Texas:'TX'}, {Utah:'UT'}, {Vermont:'VT'}, {Virginia:'VA'}, {Washington:'WA'}, {"West Virginia":'WV'}, {Wisconsin:'WI'}, {Wyoming:'WY'}
];
let employeesHTML = [];
let modalHTML = '';

//===============================================
//     Use FETCH to retrieve data from API
//===============================================
fetch (urlAPI)
    .then(response => response.json())
    // .then(data => console.log(data))
    .then(response => response.results)
    .then(displayEmployees)
    .catch(error => console.log(error));

//===============================================
//          Display Employees
//===============================================
function displayEmployees(employeeData) {
    employees = employeeData;
    let employeeHTML = ``;
    employees.forEach( (employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;
        
        employeeHTML = `
            <div class="card" data-index="${index}">
                <img src="${picture.large}" alt="Employee photo" class="avatar" />
                <div class="text-container">
                    <h2 class="name">${name.first} ${name.last}</h2>
                    <p class="email">${email}</p>
                    <p class="city">${city}</p>
                </div>
            </div>
        `;
        employeesHTML.push(employeeHTML);
    });
    employeesHTML.map( item => {
        container.innerHTML += item;
    });
}

//===============================================
//            Display Modal
//===============================================
function displayModal(index) {
    let { name, email, dob, phone, picture,
        location: { city, street, state, postcode}} = employees[index];
    let birthday = getBDate(dob);
    let stateAbr = statesUS.reduce((stateAbr, stateUS) => {
        if(state in stateUS) {
            stateAbr = stateUS[state];
        }
        return stateAbr;
    });
   
    modalHTML = `
        <img src="${picture.large}" alt="Employee Photo" class="avatar">
        <div class="text-container">
            <button class="left"><</button>
            <h2 class="name">${name.first} ${name.last}</h2>
            <button class="right">></button>
            <p class="email">${email}</p>
            <p class="city">${city}</p>
            <hr class="line" />
            <p class="phone">${phone}</p>
            <p class="address">${street.number} ${street.name}, ${stateAbr} ${postcode}</p>
            <p class="birthday">Birthday: ${birthday}</p>
        </div>
    `;

    overlay.classList.remove("hidden");
    modalContent.innerHTML = modalHTML;

    const leftButton = document.querySelector('.left');
    const rightButton = document.querySelector('.right');
    modalContent.addEventListener('click', (e) => {
        let arrowDirection;
            if(e.target === leftButton) {
                displayModal(getLeft(index));
            } else if (e.target === rightButton) {
                arrowDirection = getRight(index);
                displayModal(arrowDirection);
            }
    });
}

//===============================================
//                  Functions
//===============================================
function getLeft(index) {
    if (index > 0) {
        index--;
    } else {
        index = 11;  
    }
    return index;
}
function getRight(index) {
    if (index < 11) {
        index++;
    } else {
        index = 0; 
    }
    return index;
}
function getState(state) {
    statesUS.reduce((stateLetters, stateUS) => {
        if(state in stateUS) {
            stateLetters = stateUS[state];
        }
        return stateLetters;
    });
}
function getBDate(dob) {
    let bDate = `${dob.date.slice(5, 7)}/${dob.date.slice(8, 10)}/${dob.date.slice(0, 4)}`;
    return bDate;
}
function filter() {
    const searchValue = document.querySelector('.search').value;
    let cardNames = document.querySelectorAll('.name');
    for (let i = 0; i < cardNames.length; i++) {
        if (cardNames[i].innerHTML.toLowerCase().includes(searchValue.toLowerCase())) {
            cardNames[i].parentNode.parentNode.style.display = '';
        } else {
            cardNames[i].parentNode.parentNode.style.display = 'none';
        }  
    }
}

//===============================================
//              EventListeners
//===============================================

container.addEventListener('click', (e) => {
    if (e.target !== container) {
        // let indexSel = e.target.parentNode.dataset.index
        const indexSel = e.target.closest('.card').dataset.index;
        displayModal(indexSel);
    }
});

modalClose.addEventListener('click', () => {
    overlay.classList.add('hidden');
});

