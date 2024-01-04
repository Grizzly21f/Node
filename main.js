const fs = require('fs').promises;
const path = require('path');

(async () => {
        await fs.mkdir(path.join(__dirname, 'Main'));

        for (let i = 1; i <= 5; i++) {
            await fs.mkdir(path.join(__dirname, 'Main', `Dir${i}`));
            await fs.writeFile(path.join(__dirname, 'Main', `file${i}`), `hello${i}`);
        }

        const directoryPath = path.join(__dirname, 'Main');
        const files = await fs.readdir(directoryPath);

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const stats = await fs.stat(filePath);

            if (stats.isFile()) {
                console.log(`${file} - file`);
            } else if (stats.isDirectory()) {
                console.log(`${file} - Dir`);
            }
        }
})();
