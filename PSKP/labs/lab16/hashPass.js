const bcrypt = require('bcrypt');
const fs = require('fs');

const users = [
    {
        id: 0,
        name: "Valery",
        password: "valery"
    },
    {
        id: 1,
        name: "userTest",
        password: "user"
    }
];

const hashedUsers = users.map(user => {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(user.password, saltRounds);
    return { name: user.name, password: hashedPassword };
});

// Сохранение хешированных пользователей в файл
fs.writeFile('usersHash.json', JSON.stringify(hashedUsers), err => {
    if (err) {
        console.error('Failed to write users.json:', err);
    } else {
        console.log('Users successfully saved to users.json');
    }
});