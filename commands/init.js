/**
 * @since 2016-11-16 10:20
 * @author vivaxy
 */

import path from 'path';
import execa from 'execa';
import inquirer from 'inquirer';

import fileExists from '../file/fileExists';
import directoryExists from '../file/directoryExists';
import * as configManager from '../lib/configManager';
import updateScaffoldStat from '../lib/updateScaffoldStat';
import checkGitRepository from '../git/checkGitRepository'
import getGitRemote from '../git/getRemote';
import getInfoFromShell from '../lib/getInfoFromShell';
import { GTHome } from '../config';

import getCopyFiles from '../presets/copyFiles';
import getWriteFile from '../presets/writeFile';
import getUpdateFile from '../presets/updateFile';
import getWriteJson from '../presets/writeJson';
import getUpdateJson from '../presets/updateJson';

const projectGTFile = `scripts/gt.js`;

const cwd = process.cwd();

export default async() => {

    const userConfig = configManager.read();
    const scaffoldConfig = userConfig.scaffold;
    const scaffoldNameList = configManager.readScaffoldListByStatOrder();

    const answer = await inquirer.prompt([
        {
            type: `list`,
            name: `scaffold`,
            message: `choose scaffold...`,
            choices: scaffoldNameList,
        }
    ]);

    const selectedScaffoldName = answer.scaffold;
    const selectedScaffoldRepo = scaffoldConfig[selectedScaffoldName].repo;
    const selectedScaffoldFolder = path.join(GTHome, selectedScaffoldName);

    const selectedScaffoldFolderExists = await directoryExists(selectedScaffoldFolder);
    if (!selectedScaffoldFolderExists) {
        const clone = await execa(`git clone ${selectedScaffoldRepo} ${selectedScaffoldFolder}`);
        if (clone.code !== 0) {
            console.log(`clone error: ${selectedScaffoldRepo}
${clone.stderr}`);
            process.exit(1);
        }
    }

    process.chdir(selectedScaffoldFolder);
    console.log(process.cwd());
    console.log(`git pull...`);
    await execa(`git`, [`pull`]);
    console.log(`npm install...`);
    await execa(`npm`, [`install`]);
    process.chdir(cwd);

    const projectGTFilePath = path.join(GTHome, selectedScaffoldName, projectGTFile);

    const projectGTFileExists = await fileExists(projectGTFilePath);
    if (projectGTFileExists) {
        try {
            const projectGT = require(projectGTFilePath);
            let projectGit = null;

            const isGitRepository = await checkGitRepository();
            if (isGitRepository) {
                const remote = await getGitRemote();
                const repositoryURL = await getInfoFromShell(`git`, [`remote`, `get-url`, remote]);
                projectGit = {
                    repositoryURL,
                };
            }

            const GTInfo = {
                project: {
                    folder: cwd,
                    name: cwd.split(path.sep).pop(),
                    git: projectGit,
                },
                scaffold: {
                    folder: selectedScaffoldFolder,
                    name: selectedScaffoldName,
                },
            };

            GTInfo.presets = {
                copyFiles: getCopyFiles(GTInfo),
                writeFile: getWriteFile(GTInfo),
                updateFile: getUpdateFile(GTInfo),
                writeJson: getWriteJson(GTInfo),
                updateJson: getUpdateJson(GTInfo),
            };

            await projectGT.init(GTInfo);

            await updateScaffoldStat(selectedScaffoldName);

        } catch (ex) {
            console.log(ex);
        }
    } else {
        console.log(`no gt script found in ${selectedScaffoldName}`);
    }
}
