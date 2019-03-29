//const mainSelector = document.querySelector('main');
const users = {
    all: 'all',
    nonActive: 'nonActive',
    negativeBalance: 'negativeBalance'
}
const tableBodySelector = document.querySelector('#tableBodySelector');
let tableRowSelector = document.querySelectorAll('tr');
let userFormSelector = document.querySelector('form');
const totalBalanceSelector = document.querySelector('#totalBalance');
const allCustTabSelector = document.querySelector('#allCustTab');
const nonActiveCustTabSelector = document.querySelector('#nonActiveCustTab');
const negativeBalanceCustTabSelector = document.querySelector('#negativeBalanceCustTab');
let selectedRowSelector;
let allUsers;
let currentUsersList;

window.addEventListener('load', async event => {
    await renderUsersTable();
    renderTotalBalance();
});

allCustTabSelector.addEventListener('click', event => {
    renderUsersTable(users.all);
});

nonActiveCustTabSelector.addEventListener('click', event => {
    renderUsersTable(users.nonActive);
});

negativeBalanceCustTabSelector.addEventListener('click', event => {
    renderUsersTable(users.negativeBalance);
});

function renderTotalBalance() {
    totalBalanceSelector.innerHTML = calculateTotalBalance();
}

function calculateTotalBalance() {
    let balance = 0;
    currentUsersList.map(user => {
        balance += parseFloat(user.balance.replace(/,/g, "."));
    });
    return Math.round(balance * 1000) / 1000;
}

async function renderUsersTable(selectedTab) {
    /*await getAllUsers();
    currentUsersList = allUsers;
    renderTable(currentUsersList);*/
    await getUsers(selectedTab);
    renderTable(currentUsersList);
    makeTableRowsClickable();
}

async function getUsers(selectedTab) {
    await getAllUsers();
    filterUsers(selectedTab);
}

function filterUsers(selectedTab) {
    currentUsersList = [];
    switch (selectedTab) {
        case users.all:
            currentUsersList = allUsers;
            break;
        case users.nonActive:
            allUsers.forEach(user => {
                if (!user.isActive) currentUsersList.push(user);
            });
            break;
        case users.negativeBalance:
            allUsers.forEach(user => {
                const userBalance = parseFloat(user.balance.replace(/,/g, "."));
                if (userBalance < 0) currentUsersList.push(user);
            });
            break;
        default:
            currentUsersList = allUsers;
    }
}

async function getAllUsers() {
    const res = await fetch('https://api.myjson.com/bins/1eyqeh');
    allUsers = await res.json();
}

function renderTable(users) {
    tableBodySelector.innerHTML = '';
    tableBodySelector.insertAdjacentHTML('beforeend', users.map(user => {
        return `<tr class="content">
                    <td class="index">${user.index + 1}</td>
                    <td >${user.name}</td>
                    <td >${user.company}</td>
                    <td >${user.balance}</td>
                    <!--<td>${user.email}</td>
                    <td>${user.phone}</td>-->
                </tr>`;
    }).join(' '));
}

function makeTableRowsClickable() {
    tableRowSelector = document.querySelectorAll('tr');
    [...tableRowSelector].map((tableRow, rowIndex) => {
        if (rowIndex === 0) return;
        tableRow.addEventListener('click', event => {
            const rowUserIndex = parseInt(tableRow.children[0].innerHTML);
            markSelected(tableRow, rowIndex);
            showSelectedUser(rowUserIndex);
        })
    });
}

function markSelected(tableRow, index) {
    if (selectedRowSelector) selectedRowSelector.classList.remove('selected');
    selectedRowSelector = tableRow;
    selectedRowSelector.classList.add('selected');
}

function showSelectedUser(index) {
    const user = findUser(index);
    renderUser(user);
}

function findUser(index) {
    var i;
    for (i = 0; i < allUsers.length; i++) {
        if (allUsers[i].index === index - 1)
            return allUsers[i];
    }
    return null;
}

function renderUser(user) {
    if (!user) return;
    [...userFormSelector.elements].map(element => {
        switch (element.id) {
            case 'id':
                element.value = user._id;
                break;
            case 'name':
                element.value = user.name;
                break;
            case 'active':
                element.value = user.isActive;
                break;
            case 'balance':
                element.value = user.balance;
                break;
            case 'discount':
                element.value = Math.round(((parseFloat(user.balance.replace(/,/g, ".")) * 10)/100) * 1000) / 1000;
                break;
            case 'age':
                element.value = user.age;
                break;
            case 'gender':
                element.value = user.gender;
                break;
            case 'company':
                element.value = user.company;
                break;
            case 'email':
                element.value = user.email;
                break;
            case 'phone':
                element.value = user.phone;
                break;
            case 'address':
                element.value = user.address;
                break;
            default:
                console.log('[ERROR] Unknown id: ', element.id);
        }
    });
}