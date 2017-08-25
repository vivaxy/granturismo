import fs from 'fs';

export default async(dirname, excepts = []) => {
    return await new Promise((resolve, reject) => {
        fs.readdir(dirname, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files.filter((filename) => {
                    return !excepts.includes(filename);
                }).length === 0);
            }
        });
    });
};
