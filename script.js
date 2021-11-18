'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
//account objects
const account1 = {
  owner: 'Kunal Singhdeo',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Prateek Kumar',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Rishikesh Pandey',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Ranveer Malhotra',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    
          <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}₹</div>
          </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
displayMovements(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}₹`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}₹`;

  const interest = acc.movements //interest = 1.2%
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int > 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}₹`;
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
console.log(accounts);
createUserNames(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(currentAccount.movements);

  //Display balance
  calcDisplayBalance(currentAccount);

  //Display Summary
  calcDisplaySummary(currentAccount);
};

const calcDisplayBalance = function (acc) {
  console.log(acc);
  acc.balance = acc.movements.reduce((arr, mov) => arr + mov, 0);

  console.log(movements);
  //console.log(`Balance is ${balance}`);
  labelBalance.textContent = `${acc.balance}₹`;
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //in each call print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 sec, stop timer and logout user
    if (time == 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get Started';
      containerApp.style.opacity = 0;
    }

    //Decrease by 1 sec
    time--;
  };
  //setting the time to 5 minutes
  let time = 300;

  // call timer every second,
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//Event handling
let currentAccount, timer;

//FAKE ALWAYS LOGGED IN
//currentAccount = account1
//updateUI(currentAccount)
//containerApp.style.opacity = 100

btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();
  //console.log('LOGIN');
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //DISPLAY UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    //UPDATE UI
    updateUI(currentAccount);
  } else {
    alert('Incorrect user or password');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc?.userName !== currentAccount?.userName
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(+amount);

    //UPDATE UI
    updateUI(currentAccount);

    //Reset the Timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)) {
    setTimeout(function () {
      //Add movement
      currentAccount.movements.push(amount);

      //Addloan date
      //currentAccount.movementsDates.push(new Date().toISOString());

      //Update UI
      updateUI(currentAccount);

      //Reset the Timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    console.log(index);

    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  //Clearing the fields
  inputCloseUsername.value = inputClosePin.value = '';
});

//sorting movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted; //toggle Sort
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

//SLICE
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice(-5, 4));
console.log(arr.slice());
console.log([...arr]);

//SPLICE
//console.log(arr.splice(2));
//console.log(arr.splice(-1));
console.log(arr);
console.log(arr.splice(1, 3));

//REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log(arr);
console.log([...arr, ...arr2]);

//JOIN
console.log(letters.join('_'));

//Push, pop, shift, unshift, indexOf

*/
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1} You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1} You withdrew ${Math.abs(movement)}`);
  }
}

console.log(`//ForEach//`);
movements.forEach(function (movement, i, arr) {
  if (movement > 0) {
    console.log(`Movement ${i + 1} You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1} You withdrew ${Math.abs(movement)}`);
  }
});

//function(200)
//1. function(450)
//2. function(-400)
//3 ......
//...
*/
/*
//forEach with MAps and sets

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key} : ${value}`);
});

//Sets
/*
const currenciesUnique = new Set([
  'USD',
  'INR',
  'GBP',
  'EUR',
  'INR',
  'PS',
  'USD',
]);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, key, value) {
  console.log(`${key1} : ${value1}`);
});

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
*/
/*
currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, key, map) {
  console.log(`${value}: ${value}`);
});
*/

// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them
 asked 5 dog owners about their dog's age, and stored the 
 data into an array (one array for each). For now, they 
 are just interested in knowing whether a dog is an 
 adult or a puppy. 
 A dog is an adult if it is at least 3 years old, and 
 it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 
2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), 
and does the following things:

1. Julia found out that the owners of the FIRST and the 
LAST TWO dogs actually have cats, not dogs! 
So create a shallow copy of Julia's array, and 
remove the cat ages from that copied 
array (because it's a bad practice to mutate 
function parameters)
2. Create an array with both Julia's (corrected) and 
Kate's data
3. For each remaining dog, log to the console whether 
it's an adult ("Dog number 1 is an adult, and is 
5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], 
Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], 
Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀


const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  //dogsJulia.slice(1,3)
  console.log(dogsJuliaCorrected);

  const dogs = dogsJuliaCorrected.concat(dogsKate);
  console.log(dogs);

  dogs.forEach(function (ele, i) {
    const category = ele >= 3 ? 'an adult' : 'still a puppy 🐶';
    if (ele >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is 
      ${ele} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy 🐶`);
    }
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
*/

//MAP METHOD
/*
const eurToRupee = 86;

const movementsRupee = movements.map(function (mov) {
  return mov * eurToRupee;
});
console.log(movements);
console.log(movementsRupee);

const movementRupeeArr = movements.map(mov => mov * eurToRupee);
console.log(movementRupeeArr);

const movementsEur = [];


for (const mov of movements) movementsEur.push(mov * eurToRupee);
console.log(movementsEur);

const movementsDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movementsDescription);
*/
/*
const deposits = movements.filter(mov => mov > 0);
console.log(movements);
console.log(deposits);

const withdrawal = movements.filter(mov => mov < 0);
console.log(withdrawal);
*/
/*
//Reduce Method
console.log(movements);

//accumulator--> 1st element --> SNOWBALL
const balance = movements.reduce((arr, cur) => arr + cur);
console.log(balance);

let sum = 0;
for (const mov of movements) {
  sum += mov;
}
console.log(sum);

//Maximum value
const max = movements.reduce((acc, mov) => {
  console.log(`${acc}, ${mov}`);
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);
*/
///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. 
This time, they want to convert dog ages to human ages 
and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts 
an arrays of dog's ages ('ages'), 
and does the following things in order:

1. Calculate the dog age in human years using the following 
formula: if the dog is <= 2 years old, 
humanAge = 2 * dogAge. If the dog is > 2 years old, 
humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old 
(which is the same as keeping dogs that are at least 18 
  years old)
3. Calculate the average human age of all adult dogs 
(you should already know from other challenges how we 
  calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*
const humanAge = [];
const calcAverageHumaAge = function (ages) {
  const humanAge = ages.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
  const adults = humanAge.filter(age => age >= 18);
  console.log(humanAge);
  console.log(adults);
  //const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  const average = adults.reduce(
    (acc, age, i, arr) => acc + age / arr.length,
    0
  );
  console.log(average);
};

calcAverageHumaAge([5, 2, 4, 1, 15, 8, 3]);
*/
/*
const eurToRupee = 86;
console.log(movements);

//PIPELINE
const totalDepositInr = movements
  .filter(mov => mov < 0)
  //.map(mov => mov * eurToRupee)
  .map((mov, i, arr) => {
    console.log(arr);
    return mov * eurToRupee;
  })
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositInr);
*/
///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*
//Solution
const calcAverageHumaAge = ages =>
  ages
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const avg1 = calcAverageHumaAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumaAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);
*/
/*
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Kunal Singhdeo');
console.log(account);
*/
// //SOME
// console.log(movements);
// //EQUALITY
// console.log(movements.includes(-400));

// //CONDITION
// console.log(movements.some(mov => mov === -130));
// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

//EVERY
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

//CALLBACK

// const deposit = mov => mov > 0;
// console.log(deposit);
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

//Flat & FlatMap ES2019

const arr = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8, [9]];
console.log(arrDeep.flat(2)); //2levels deep
//console.log(arrDeep.flatMap());

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overAllBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overAllBalance);
/*
//using the above in chaining
const overAllBalance = accounts
  // .map(acc => acc.movements)
  // .flat()
  .flatMap(acc => acc.movements)  //flatMap goes 1 step deep
  .reduce((acc, mov) => acc + mov, 0);
console.log(`Overall balance is ${overAllBalance}`);
*/
/*
//Sorting    //only work on strings
//Strings
const owners = ['ajay', 'ranjeeta', 'ankit', 'rahul'];
console.log(owners.sort());
console.log(owners);

//Numbers
console.log(movements);
//console.log(movements.sort());  //sorting works on strings only

//return < 0,  A,B  -> keep order
//return > 0,  B,A  -> switch order
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
movements.sort((a, b) => a - b);
console.log(movements);

//descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);

const arr1 = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
console.log(x);
//console.log(x.map(() => 5));

x.fill(1);
console.log(x);
x.fill(2, 3, 5);
console.log(x);

arr1.fill(23, 2, 4);
console.log(arr1);

//Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

// _ throw away variable as we don't need it in future
const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    ele => Number(ele.textContent.replace('₹', ''))
  );
  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')].map(
    ele => Number(ele.textContent.replace('₹', ''))
  );
  console.log(movementsUI2);
});
*/

//Array Methods Practice
//1
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, curr) => sum + curr, 0);
console.log(bankDepositSum);

// const deposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

//2
const deposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, curr) => (curr >= 1000 ? ++count : count), 0);
console.log(deposits1000);

let a = 10;
console.log(a++);
console.log(a);

let b = 20;
console.log(b++);
console.log(b);

//3.
const { deposits, withdrawal } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, curr) => {
      curr > 0 ? (sums.deposits += curr) : (sums.withdrawal += curr);

      // sums[curr > 0 ? 'deposits' : 'withdrawal'] += curr;
      return sums;
    },
    { deposits: 0, withdrawal: 0 }
  );

console.log(deposits, withdrawal);

//4. string to titlecase
//this is a nice title --> This Is a Nice title

const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

/*
//1
dogs.forEach(dog => (dog.recmFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

//2
const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(sarahDog);
console.log(
  `Sarah Dog is eating ${
    sarahDog.curFood > sarahDog.recmFood ? 'much' : 'little'
  } `
);

//3
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recmFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recmFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

//4
// "Matilda and Alice and Bob's dogs eat too much!"
//  and
// "Sarah and John and Michael's dogs eat too little!"
console.log(`${ownersEatTooMuch.join(' and ')} dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')} dogs eat too little!`);

//5
console.log(dogs.some(dog => dog.curFood === dog.recmFood));

//6
const checkEatingOkay = dog =>
  dog.curFood > dog.recmFood * 0.9 && dog.curFood < dog.recmFood * 1.1;

console.log(dogs.some(checkEatingOkay));

//7
console.log(dogs.filter(checkEatingOkay));

//8
const dogsCopy = dogs.sort((a, b) => a.recmFood - b.recmFood);
console.log(dogsCopy);
*/
/*
//setTimeOut
const ingredients = ['olives', 'jalepinos'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza 🍕 with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
);
console.log('Waiting...');

if (ingredients.includes('jalepinos')) clearTimeout(pizzaTimer);

//setInterval
setInterval(function () {
  const now = new Date();
  console.log(now);
}, 1000);
*/
