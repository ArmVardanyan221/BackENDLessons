const fs = require('fs/promises');

const command = process.argv[2];

async function createCommandHandler() {
    const name = process.argv[3];
    const extensions = ['txt', 'js', 'css', 'html', 'json', 'xml', 'md', 'csv', 'txt', 'js', 'css', 'html', 'json', 'xml', 'md', 'csv'];
    await fs.mkdir(`${name}`, { recursive: true });
    for (let i = 0; i < 15; i++) {
        const randomExtension = extensions[Math.floor(Math.random() * extensions.length)];
        const fileName = `${i}.${randomExtension}`;
        await fs.writeFile(`${name}/${fileName}`, '');
    }
}

async function moveCommandHandler() {
    const name = process.argv[3];
    const files = await fs.readdir(`${name}`);
    await fs.mkdir('result', { recursive: true });
    for (const file of files) {
        const extension = file.split('.').pop();
        await fs.mkdir(`result/${extension}`, { recursive: true });
        await fs.rename(`${name}/${file}`, `result/${extension}/${file}`);
    }
    await fs.rm(`${name}`, { recursive: true, force: true });
}

async function deleteCommandHandler() {
    const name = process.argv[3];
    await fs.rm(`${__dirname}/${name}`, { recursive: true, force: true });
}

;(async () => {
    if (command === 'create') {
        await createCommandHandler();
    } else if (command === 'move') {
        await moveCommandHandler();
    } else if (command === 'delete') {
        await deleteCommandHandler();
    }
})().catch((error) => {
    console.error(error);
    process.exit(1);
});

