'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Peter Parker',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-04-18T21:31:17.178Z',
    '2023-05-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-06-25T10:17:24.185Z',
    '2023-06-05T14:11:59.604Z',
    '2023-06-26T17:01:17.194Z',
    '2023-06-30T23:36:17.929Z',
    '2023-07-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: navigator.language, // de-DE
};

const account2 = {
  owner: 'Eddie brock',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Rober Downy Jr',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Mohamed',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];
accounts.forEach(acc => console.log(acc));
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//FUNCTIONS
const calcDays = (date1, date2) =>
  Math.abs(Math.round((date1 - date2) / (1000 * 60 * 60 * 24)));

const formatDates = function (date, locale) {
  const daysPassed = calcDays(new Date(), date);
  if (daysPassed === 0) return 'Today';
  else if (daysPassed === 1) return 'Yesterday';
  else if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
};
const formatnumbers = (number, account) =>
  new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(number);

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach((mov, i) => {
    const text = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(account?.movementsDates[i]);
    const html = `       
  <div class="movements__row">
   <div class="movements__type movements__type--${text}">${i + 1} ${text}</div>
   <div class="movements__date">${formatDates(date, account.locale)}</div>
   <div class="movements__value">${formatnumbers(mov, account)}</div>
 </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displaysummary = account => {
  labelSumIn.textContent = formatnumbers(
    account.movements.filter(mov => mov >= 0).reduce((acc, curr) => acc + curr),
    account
  );

  labelSumOut.textContent = formatnumbers(
    account.movements
      .filter(mov => mov < 0)
      .reduce((acc, curr) => Math.abs(acc + curr)),
    account
  );

  labelSumInterest.textContent = formatnumbers(
    account.movements
      .filter(mov => mov > 0)
      .map(deposit => Math.trunc(deposit * (account.interestRate / 100)))
      .filter(int => int > 1)
      .reduce((acc, cur) => acc + cur),
    account
  );
};

const displayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatnumbers(account.balance, account);
};
const updateUI = account => {
  displayMovements(account);
  displaysummary(account);
  displayBalance(account);
};

const startlogountTimer = _ => {
  let timer = 120;
  const beforelog = function () {
    const minutes = String(Math.trunc(timer / 60)).padStart(2, 0);
    let seconds = String(timer % 60).padStart(2, 0);

    labelTimer.textContent = `${minutes}:${seconds}`;

    if (timer === 0) {
      clearInterval(logout);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    timer--;
  };
  beforelog();
  const logout = setInterval(beforelog, 1000);
  return logout;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

//BUTTONS
let currentAccount, timerout;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    if (timerout) clearInterval(timerout);
    timerout = startlogountTimer();
    updateUI(currentAccount);
    containerApp.style.opacity = 100;
    const now = new Date();
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, {
      hour: 'numeric',
      minute: 'numeric',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(now);
  }
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();
  inputLoginUsername.blur();
});

let transferedAccount;

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  transferedAccount = accounts.find(
    acc => inputTransferTo.value === acc.username
  );
  const amount = +inputTransferAmount.value;
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    transferedAccount &&
    transferedAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    transferedAccount.movements.push(amount);
    transferedAccount.movementsDates.push(new Date().toISOString());
    clearInterval(timerout);
    timerout = startlogountTimer();
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      clearInterval(timerout);
      timerout = startlogountTimer();
      updateUI(currentAccount);
    }, 2500);
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  labelWelcome.textContent = 'Log in to get started';
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
